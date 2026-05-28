---
name: ssd-lineoa-contact
description: ใช้ skill นี้เมื่อต้องการเชื่อมต่อ Line OA (Official Account) contact เข้า .NET project, ติดตั้ง LineOAPA.Shared.dll จาก private GitHub release, ตั้งค่า MassTransit RabbitMQ request clients, หรือส่งข้อความผ่าน Line OA ตามมาตรฐาน SSD
version: 1.0.0
---

# SSD Line OA Contact — การเชื่อมต่อ Line OA ใน .NET Project

## บริบท

SSD มี shared library `LineOAPA.Shared.dll` ที่ใช้เชื่อมต่อกับ Line OA Platform API ทุก .NET project ที่ต้องการส่งข้อความหรือจัดการ contact ผ่าน Line OA ต้องติดตั้ง DLL นี้และตั้งค่า MassTransit RabbitMQ ผ่านขั้นตอน 3 ขั้น

Request clients ที่มีให้ใช้:
- `LinkUserToAccessRichMenu` — เชื่อม user เข้า Rich Menu
- `UnlinkUserFromAccessRichMenu` — ยกเลิกการเชื่อม user จาก Rich Menu
- `RequestSendMessagesToUsers` — ส่งข้อความหา users

---

## กฎหลัก

1. **Workspace** = โฟลเดอร์ root ของ repo — โฟลเดอร์ที่มีไฟล์ `.sln` อยู่ ห้าม `cd` เข้าไปใน subfolder
2. **PROJECT** = โฟลเดอร์ที่มีไฟล์ `.csproj` (ต้องหาก่อนเสมอ — ห้ามเดา)
3. DLL ต้องอยู่ที่ `{PROJECT}/Contracts/LineOAPA.Shared.dll` เท่านั้น ห้ามมี subfolder, .zip, หรือ .pdb
4. ห้ามสร้าง `Contracts/` ที่ workspace root โดยตรง (เฉพาะกรณี PROJECT เป็น subfolder)
5. ห้ามแก้ไข `Startup.cs` ถ้ามี `services.AddMassTransit` อยู่แล้ว
6. ห้ามลบ `KafkaSetting` — แก้เฉพาะ `EnableRabbitMQ` และ `Port` ใน appsettings.json
7. ห้ามแก้ไข ItemGroup entries อื่นใน `.csproj`
8. ห้ามสร้าง `YourService.cs` หรือ service file ใดๆ หากไม่ได้รับคำสั่ง

### ตาราง path ที่ถูกต้อง

| mkdir command | เมื่อ | ผล |
|---|---|---|
| `mkdir $PROJECT/Contracts` | workspace มี .sln, PROJECT เป็น subfolder | **ถูก** |
| `mkdir Contracts` | PROJECT เป็น subfolder ไม่ใช่ workspace root | **ผิด** — สร้างที่ root แทน |
| `mkdir $PROJECT/$PROJECT/Contracts` | อยู่ใน PROJECT folder แล้ว | **ผิด** — ซ้ำซ้อน |

ตัวอย่าง (TestSkills.API):
```
{workspace}/TestSkills.API.sln
{workspace}/TestSkills.API/TestSkills.API.csproj
{workspace}/TestSkills.API/Contracts/LineOAPA.Shared.dll   ← ถูก
{workspace}/Contracts/                                      ← ผิด
{workspace}/TestSkills.API/TestSkills.API/Contracts/       ← ผิด
```

---

## ขั้นตอนที่ 1: ตรวจหา Workspace และ PROJECT

```bash
# ยืนยันว่าอยู่ที่ workspace (repo root)
pwd
ls *.sln

# หา PROJECT folder
ls */*.csproj
# ตัวอย่าง: TestSkills.API/TestSkills.API.csproj → PROJECT=TestSkills.API
# ตัวอย่าง: LineOAPASAPI/LineOAPASAPI.csproj     → PROJECT=LineOAPASAPI
# ตัวอย่าง: MyApi.csproj ที่ root               → PROJECT=.

PROJECT=<ชื่อโฟลเดอร์ที่มี .csproj>
```

---

## ขั้นตอนที่ 2: ดาวน์โหลดและติดตั้ง DLL

ดาวน์โหลดจาก private GitHub repo — ต้องใช้ `gh` เท่านั้น (ห้ามใช้ curl)

```bash
# ลบ Contracts ผิดที่ที่อาจเคยสร้างไว้
rm -rf ./Contracts
rm -rf ./$PROJECT/$PROJECT

# ดาวน์โหลดและแตกไฟล์
mkdir -p $PROJECT/Contracts
gh release download v1.1.0 -R SiamsmileDev/LineOAPASAdmin_API -p LineOAPA.Shared.zip -D .
tar -xf LineOAPA.Shared.zip -C $PROJECT/Contracts
mv $PROJECT/Contracts/LineOAPA.Shared/LineOAPA.Shared.dll $PROJECT/Contracts/ 2>/dev/null || true
rm -rf $PROJECT/Contracts/LineOAPA.Shared
rm -f $PROJECT/Contracts/*.pdb LineOAPA.Shared.zip

# ตรวจสอบ
ls -la $PROJECT/Contracts/LineOAPA.Shared.dll
```

---

## ขั้นตอนที่ 3: เพิ่มการตั้งค่าใน Project Files

แทนที่ `{ProjectFolder}` ด้วยชื่อ PROJECT จากขั้นตอนที่ 1 ทุก path เป็น relative จาก workspace

### ไฟล์ที่ 1: `{ProjectFolder}/{ProjectFolder}.csproj`

เพิ่ม `<ItemGroup>` ใหม่สำหรับ DLL reference:

```xml
<ItemGroup>
  <Reference Include="LineOAPA.Shared">
    <HintPath>Contracts\LineOAPA.Shared.dll</HintPath>
  </Reference>
</ItemGroup>
```

### ไฟล์ที่ 2: `{ProjectFolder}/appsettings.json`

เพิ่ม หรือแก้ไขค่าเหล่านี้ (ห้ามลบ KafkaSetting):

```json
"EnableRabbitMQ": true,
"Port": 5672,
```

### ไฟล์ที่ 3: `{ProjectFolder}/ProjectSetup.cs`

เพิ่ม `using` และ request clients ใน `AddMassTransit` block:

```csharp
using LineOAPA.Shared;

// ใน configure block ของ AddMassTransit:
configure.AddRequestClient<LinkUserToAccessRichMenu>();
configure.AddRequestClient<UnlinkUserFromAccessRichMenu>();
configure.AddRequestClient<RequestSendMessagesToUsers>();
```

---

## ขั้นตอนที่ 4: ตรวจสอบ Build

```bash
PROJECT=<ชื่อ PROJECT ของคุณ>

dotnet build $PROJECT/$PROJECT.csproj

# ตรวจสอบว่า DLL อยู่ที่ถูกต้องและไม่มีโฟลเดอร์ผิดที่
test -f $PROJECT/Contracts/LineOAPA.Shared.dll
! test -d ./Contracts
! test -d $PROJECT/$PROJECT
ls $PROJECT/Contracts/
```

Build ผ่านและ `LineOAPA.Shared.dll` อยู่ที่ `{PROJECT}/Contracts/` = สำเร็จ
