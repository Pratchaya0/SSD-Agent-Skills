
# SSD Backend Feature — สร้าง Feature ใหม่จาก Natural Language

## บริบท

ใช้ skill นี้ในโปรเจค ASP.NET Core ที่ setup ด้วย `backend-setup` ไปแล้ว เพื่อสร้าง feature ใหม่จากคำอธิบายแบบ natural language (เช่น "API จัดการ order พร้อม list/create/update") ให้เป็นโค้ดครบ Service → Controller → DTO สำหรับ entity เดียว — ถ้าต้องการ review code ที่มีอยู่แล้วใช้ `backend-review` แทน

**ข้อจำกัดสำคัญที่ต่างจาก `frontend-feature`/`python-feature`:** backend ของ SSD ใช้ database-first (`backend-setup.md` กฎข้อ 4) — EF Core `Model` class ถูกสร้างผ่าน EF Core Power Tools Reverse Engineer (Visual Studio GUI extension) เท่านั้น ไม่ใช่ CLI หรือ AI ที่เขียนเองได้ ดังนั้น skill นี้**ไม่สร้าง EF Core Model class แทนผู้ใช้เด็ดขาด** — ดูขั้นตอนที่ 0a

## กฎหลัก

1. ต้องตีความ feature description ก่อนเขียนโค้ดเสมอ (ดูขั้นตอนที่ 0) — ห้ามเดาแล้วเริ่มเขียนโค้ดทันทีถ้าข้อมูลไม่พอ ใช้ AskUserQuestion ถาม
2. **ต้องเช็คว่า EF Core Model ของ entity มีอยู่จริงก่อนเขียนโค้ดชั้นอื่นเสมอ** (ขั้นตอนที่ 0a) — ถ้าไม่มี ต้องหยุดและบอกผู้ใช้ให้ออกแบบตารางแล้วทำ EF Core Power Tools Reverse Engineer เอง ห้ามเขียน Model class ขึ้นมาเองเป็นทางลัดเด็ดขาด เพราะจะขัดกับ Reverse Engineer รอบจริงที่จะ overwrite/conflict กับไฟล์ที่เขียนมือ
3. ต้องสร้างตามลำดับ layer เดียวกับ `dotnet-service.md`/`dotnet-controller.md` เสมอ: Service (Interface + Implementation + DTO + AutoMapper) → Controller — ห้ามข้ามลำดับ
4. ทุก service ต้องมี interface คู่กันและ inject ผ่าน DI เท่านั้น (`dotnet-service.md` กฎข้อ 1-3) — ห้าม `new` class ใน service
5. ทุก endpoint ใหม่ต้องตาม REST policy เดิม (GET/POST เท่านั้น, ห้าม PUT/PATCH/DELETE, update/delete ใช้ POST + `{id}/update`/`{id}/delete`)
6. ต้องใช้ AutoMapper ผ่าน `AutoMapperProfile.cs` เท่านั้น ห้ามใช้ `MappingExtension` class
7. ก่อนเขียนโค้ดแต่ละชั้น ต้องอ่านไฟล์ reference ของชั้นนั้นด้วย Read tool ก่อนเสมอ (`dotnet-service.md`, `dotnet-controller.md`, และ `dotnet-infra.md` ถ้ามี external API/background job) — ห้ามเขียนจากความจำ

---

## ขั้นตอนที่ 0: ตีความ Feature Description

จาก feature description ที่ user ให้มา ต้องตอบคำถามเหล่านี้ก่อนเริ่มเขียนโค้ด (ถ้าไม่ชัดเจน ใช้ AskUserQuestion ถาม):

| คำถาม | ผลต่อโค้ด |
|-------|----------|
| Entity/table ชื่ออะไร (PascalCase เอกพจน์ ตาม `database.md`)? | ใช้เป็น `{Entity}` ตลอด — ต้องเช็ค Model ก่อนเสมอ (ขั้นตอนที่ 0a) |
| ต้องเรียก external API (เช่น LINE, payment gateway) ไหม? | ต้อง → สร้าง RestSharp client ตาม `dotnet-infra.md` ส่วนที่ 3 |
| ต้องมี scheduled/background job ไหม? | ต้อง → สร้าง Quartz job ตาม `dotnet-infra.md` ส่วนที่ 2 |
| โปรเจคเปิด `OAuth.EnableOAuth: true` ไหม? | เปิด → Controller ต้องอ่าน Scope/Audience จริงจาก `appsettings.json` ตาม `dotnet-controller.md` กฎข้อ 9 |

## ขั้นตอนที่ 0a: เช็คว่า EF Core Model มีอยู่จริง (หยุดถ้าไม่มี)

ก่อนเขียนโค้ดใดๆ ที่อ้างถึง `{Entity}` ต้องตรวจสอบว่า Model มีอยู่จริงในโปรเจค:

1. ใช้ Glob tool หา `**/Models/{Entity}.cs` (และ `**/Models/{Entity}*.cs` เผื่อชื่อไม่ตรงเป๊ะ)
2. ถ้าไม่เจอ ใช้ Grep tool หา `class {Entity}` ทั้งโปรเจค เผื่อ Model อยู่ folder อื่น

**ถ้าไม่เจอ Model เลย — หยุดทันที** บอกผู้ใช้ว่า:
> ยังไม่มี EF Core Model สำหรับ `{Entity}` ต้องออกแบบตาราง `{Entity}` ก่อนตาม `database.md` (PascalCase, standard columns: `IsActive`/`CreatedByUserId`/`CreatedDate`/`UpdatedByUserId`/`UpdatedDate`, `datetime2` สำหรับวันที่) แล้วทำ EF Core Power Tools → Reverse Engineer ตาม `backend-setup.md` (คลิกขวา Project → EF Core Power Tools → Reverse Engineer → เลือกตารางนี้) ก่อน จากนั้นเรียก `backend-feature` ใหม่อีกครั้ง

ห้ามเขียน Model class ขึ้นมาเองแทน แม้จะรู้ schema คร่าวๆจาก feature description ก็ตาม — Reverse Engineer รอบจริงจะ generate ทับหรือขัดกับไฟล์ที่เขียนมือ

**ถ้าเจอ Model แล้ว** — ไปขั้นตอนที่ 1 ได้ปกติ

---

## ขั้นตอนที่ 1: Service Layer

**อ่านไฟล์ `reference/dotnet-service.md` ด้วย Read tool ก่อนเขียนโค้ด** ใช้โค้ดตัวอย่างในไฟล์นั้นตรงๆ:

1. Interface — `Services/{Entity}/I{Entity}Service.cs`
2. Service Implementation — `Services/{Entity}/{Entity}Service.cs` (inject `AppDbContext` + `IMapper` เป็นพื้นฐาน, เพิ่ม `ILoginDetailServices` ถ้าต้องข้อมูล user)
3. DTOs — `DTOs/{Entity}/{Entity}TableDto.cs`, `{Entity}ResponseDto.cs`, `{Entity}RequestDto.cs`, `{Entity}FilterDto.cs` (ตาม naming convention ในไฟล์นั้น)
4. AutoMapper entries — เพิ่มใน `AutoMapperProfile.cs`
5. DI registration — เพิ่มใน `ProjectSetup.cs` ส่วน `ConfigDependency`

## ขั้นตอนที่ 2: Controller

**อ่านไฟล์ `reference/dotnet-controller.md` ด้วย Read tool ก่อนเขียนโค้ด** สร้าง `Controllers/{Entity}Controller.cs`:

- Route `api/{entity-kebab-case}`, ทุก HTTP attribute ต้องมี `Name=`
- GET/POST เท่านั้น — update/delete ใช้ `[HttpPost("{id}/update")]`/`[HttpPost("{id}/delete")]`
- Return ผ่าน `ResponseResult` + `ServiceResponse` ทุก method
- ใช้ `ClaimPermission` attribute ถ้า feature ต้องจำกัดสิทธิ์
- ถ้า `OAuth.EnableOAuth: true` — อ่าน Scope/Audience จริงจาก `appsettings.json` ตามกฎข้อ 9 ของไฟล์นั้น (fallback `demo_pos` ถ้ายังไม่มีค่าจริง)

## ขั้นตอนที่ 3: External API / Background Job (เฉพาะถ้าต้องใช้)

**อ่านไฟล์ `reference/dotnet-infra.md` ด้วย Read tool ก่อนเขียนโค้ด**:
- เรียก external API → ส่วนที่ 3 (RestSharp) — สร้าง `Clients/{Name}Client.cs`, Option Pattern config
- ต้องมี scheduled job → ส่วนที่ 2 (Quartz) — สร้าง `HostedServices/{Name}Job.cs` พร้อม `[DisallowConcurrentExecution]`, ตั้ง cron ใน `appsettings.json`

---

## ตัวอย่างแบบสมบูรณ์: API จัดการ Order (List/Create/Update)

สมมติเช็คขั้นตอนที่ 0a แล้วพบว่ามี `Models/Order.cs` อยู่แล้ว (Reverse Engineer ไปแล้ว) — ไฟล์ที่ต้องสร้าง/แก้ทั้งหมด:

```
Services/Order/IOrderService.cs            # Interface (1)
Services/Order/OrderService.cs             # GetAllAsync, GetByIdAsync, CreateAsync, UpdateAsync (1)
DTOs/Order/OrderTableDto.cs                # แสดงในตาราง (1)
DTOs/Order/OrderResponseDto.cs             # ส่งกลับ client (1)
DTOs/Order/OrderRequestDto.cs              # รับจาก client (1)
DTOs/Order/OrderFilterDto.cs               # filter สำหรับ GetAll (1)
AutoMapperProfile.cs                       # เพิ่ม CreateMap<Order, OrderTableDto/ResponseDto>(), CreateMap<OrderRequestDto, Order>() (1)
ProjectSetup.cs                            # services.AddScoped<IOrderService, OrderService>() (1)
Controllers/OrderController.cs             # GetAll, GetById, Create, Update — GET/POST เท่านั้น (2)
```

ถ้าไม่พบ `Models/Order.cs` ในขั้นตอนที่ 0a ต้องหยุดที่นั่นและบอกผู้ใช้ตามข้อความในขั้นตอนที่ 0a — ไม่ไปขั้นตอนที่ 1 ต่อ

---

## ขั้นตอนที่ 4: Verify

```bash
dotnet build
dotnet run
```

เปิด Swagger UI (`/swagger`) ตรวจว่า endpoint ใหม่ขึ้นครบ (GET all, GET by id, POST create, POST `{id}/update`), ทดสอบเรียกจริงแล้วตรวจ response เป็น `ServiceResponse` ที่มี `isSuccess`/`data` ตามรูปแบบเดิม
