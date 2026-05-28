# SSD Skills Test Report

**วันที่ทดสอบ:** 2026-05-28  
**วิธีทดสอบ:** Simulation — สร้าง input ที่มี violations จงใจ แล้ว apply skill checklist ตรวจว่า output ถูกต้อง  
**Fixtures:** `tests/fixtures/bad_frontend.tsx`, `tests/fixtures/bad_controller.cs`, `tests/fixtures/bad_service.py`

---

## สรุป

| ผลลัพธ์ | จำนวน |
|---------|-------|
| ✅ Pass | 20 |
| ⚠️ Warning | 2 |
| ❌ Fail | 0 |
| **รวม** | **22** |

---

## Category A: Review Simulation (3 skills)

### ✅ `ssd-frontend-review` — PASS

**Input:** `tests/fixtures/bad_frontend.tsx` (8 violations จงใจ)

| # | Violation ที่ฝังไว้ | พบไหม | Category |
|---|------------------|-------|---------|
| 1 | Props type ชื่อ `Props` แทน `OrderItemListDisplayComponentProps` | ✅ | Naming |
| 2 | `any[]`, `any` ใน 3 จุด | ✅ | Types |
| 3 | `import.meta.env.VITE_API_URL` | ✅ | Env |
| 4 | `key={index}` ใน list | ✅ | Lists |
| 5 | `<React.Fragment>` | ✅ | Component |
| 6 | `useState + onChange` ใน form | ✅ | Forms |
| 7 | `axios.get()` ใน component | ✅ | API |
| 8 | `<button disabled={true}>` + ไม่มี `name` attribute | ✅ | Props + Testing |

**ผล:** พบ 8/8 violations ถูกต้อง

---

### ✅ `ssd-backend-review` — PASS

**Input:** `tests/fixtures/bad_controller.cs` (7 violations จงใจ)

| # | Violation ที่ฝังไว้ | พบไหม | Category |
|---|------------------|-------|---------|
| 1 | ไม่มี `[Authorize]` | ✅ | Authorization |
| 2 | `[Route("api/OrderHeader")]` ไม่ใช่ kebab-case | ✅ | Naming + Controller |
| 3 | `[HttpGet]` ไม่มี `Name` attribute | ✅ | Controller |
| 4 | ไม่มี XML comment บน 2 methods | ✅ | Controller |
| 5 | `orderService` ไม่มี `_` prefix | ✅ | Naming |
| 6 | `mapper.Map<T>(list)` หลัง `.ToListAsync()` | ✅ | AutoMapper |
| 7 | `return Ok(result)` ไม่ใช้ `ResponseResult` | ✅ | Controller |

**ผล:** พบ 7/7 violations ถูกต้อง  
**หมายเหตุ:** `[HttpDelete]` ใน fixture ไม่ถูก flag — ถูกต้องแล้ว เพราะ GET/POST only policy ใน SSD มีเฉพาะ Python (cursor rules) ไม่ใช่ .NET

---

### ✅ `ssd-python-review` — PASS

**Input:** `tests/fixtures/bad_service.py` (9 violations จงใจ)

| # | Violation ที่ฝังไว้ | พบไหม | Category |
|---|------------------|-------|---------|
| 1 | `from fastapi import HTTPException` ใน service file | ✅ | Architecture |
| 2 | `session = SessionLocal()` ระดับ module | ✅ | Database |
| 3 | `print(f"Getting order {order_id}")` | ✅ | Logging |
| 4 | `raise HTTPException(404)` ใน service layer | ✅ | Error Handling |
| 5 | `return row` แทน `return _to_domain(row)` | ✅ | Database |
| 6 | `print(f"Error: {str(e)}")` | ✅ | Logging |
| 7 | `@router.delete()` verb | ✅ | HTTP Methods |
| 8 | Business logic ใน job function | ✅ | Scheduler |
| 9 | Job ไม่มี `coalesce`, `max_instances`, `misfire_grace_time` | ✅ | Scheduler |

**ผล:** พบ 9/9 violations ถูกต้อง

---

## Category B: Refactor Simulation (3 skills)

### ✅ `ssd-frontend-refactor` — PASS

**Tier assignment บน bad_frontend.tsx:**

| Violation | Tier ที่ assign | ถูกต้อง? |
|-----------|--------------|---------|
| `<React.Fragment>` → `<>` | Tier 1 | ✅ |
| `disabled={true}` → `disabled` | Tier 1 | ✅ |
| `any` → `unknown` | Tier 2 (หลัง `npx tsc --noEmit`) | ✅ |
| Add `name` attribute บน Button | Tier 2 | ✅ |
| `import.meta.env` → `window.__CONST__ENV__` | Tier 2 | ✅ |
| Props type rename | Tier 3 (grep usages ก่อน) | ✅ |
| `useState` form → Formik | Tier 3 (structural change) | ✅ |
| `key={index}` | Tier 4 — skip (ต้องมี unique id จากข้อมูล) | ✅ |
| axios → useQuery | Tier 3 (structural change + check usages) | ✅ |

**ผล:** Tier assignment ถูกต้องทุกข้อ

---

### ✅ `ssd-backend-refactor` — PASS

**Tier assignment บน bad_controller.cs:**

| Violation | Tier ที่ assign | ถูกต้อง? |
|-----------|--------------|---------|
| Add XML comments | Tier 1 | ✅ |
| Add `Name` attribute ใน `[HttpGet]` | Tier 1 | ✅ |
| `orderService` → `_orderService` | Tier 2 (หลัง `dotnet build`) | ✅ |
| `return Ok()` → `ResponseResult.Success()` | Tier 2 | ✅ |
| Add `[Authorize]` | Tier 2 | ✅ |
| `Map()` after `ToList()` → `ProjectTo()` | Tier 3 (grep usages) | ✅ |
| Route `api/OrderHeader` → `api/order-header` | **Tier 4** — skip (route path breaking) | ✅ |
| `[HttpDelete]` → POST action | **Tier 4** — skip | ✅ |

**ผล:** Tier assignment ถูกต้องทุกข้อ โดยเฉพาะ route path ถูก classify เป็น Tier 4 ถูกต้อง

---

### ✅ `ssd-python-refactor` — PASS

**Tier assignment บน bad_service.py:**

| Violation | Tier ที่ assign | ถูกต้อง? |
|-----------|--------------|---------|
| `print(...)` → `log.info/exception()` | Tier 1 | ✅ |
| `print(f"Error: {str(e)}")` → `log.exception()` | Tier 1 → Tier 2 (ลบ try/except เดิม) | ✅ |
| Add `_` prefix ให้ `self.session` | Tier 2 (หลัง `uv run pytest`) | ✅ |
| Add `coalesce`, `max_instances`, `misfire_grace_time` | Tier 2 | ✅ |
| `return row` → `return _to_domain(row)` | Tier 3 (grep usages) | ✅ |
| `raise HTTPException` → `raise DomainError` | Tier 3 (grep usages + เพิ่ม domain error class) | ✅ |
| `@router.delete()` → `POST /orders/{id}/delete` | **Tier 4** — skip | ✅ |
| Module-level session → Depends injection | **Tier 4** — skip (architectural change) | ✅ |

**ผล:** Tier assignment ถูกต้องทุกข้อ

---

## Category C: Standard Knowledge (12 skills)

| # | Skill | Scenario | ตอบได้ถูก? | หมายเหตุ |
|---|-------|---------|-----------|---------|
| 1 | `ssd-frontend-setup` | ใช้ env var VITE_API_URL ยังไง? | ✅ | ตอบ `window.__CONST__ENV__` ถูก |
| 2 | `ssd-react-component` | Props type ของ OrderCard? | ✅ | ตอบ `OrderCardProps` ถูก |
| 3 | `ssd-react-form` | ทำ validation ยังไง? | ✅ | ตอบ Formik + validate function ถูก |
| 4 | `ssd-react-state` | สร้าง Redux slice ยังไง? | ✅ | ตอบ `createSlice` ถูก |
| 5 | `ssd-react-api` | เรียก GET API ยังไง? | ✅ | ตอบ `useQuery` ถูก |
| 6 | `ssd-backend-setup` | EF Core Reverse Engineer ขั้นตอน? | ✅ | ครบทุกขั้น |
| 7 | `ssd-dotnet-controller` | route ของ OrderHeader controller? | ✅ | ตอบ `api/order-header` (kebab-case) ถูก |
| 8 | `ssd-dotnet-service` | DTO สำหรับ create ตั้งชื่อยังไง? | ✅ | ตอบ `CreateDto` suffix ถูก |
| 9 | `ssd-dotnet-infra` | cron ทุกวัน 09:00 และ 16:00? | ✅ | ตอบ `0 0 9,16 ? * * *` ถูก |
| 10 | `ssd-database` | boolean column ขึ้นต้นด้วยอะไร? | ✅ | ตอบ `Is` prefix ถูก |
| 11 | `ssd-git-commit` | commit เพิ่ม Redux slice ใหม่? | ✅ | ตอบ `feat(redux): add new auth slice` ถูก |
| 12 | `ssd-git-flow` | branch feature เพิ่มหน้า login? | ✅ | ตอบ `feature/add-login-page` ถูก |

**ผล:** 12/12 ตอบถูกต้องทุก scenario

---

## Category D: Bug-Fix Accuracy (2 skills)

### ✅ `ssd-bug-std-auth-redirect-loop` — PASS

Cross-check กับ PR #21 diff จริง (`SiamsmileDev/react-ts-template-2023`):

| Code snippet ใน skill | ตรงกับ PR diff? |
|----------------------|----------------|
| `authRedirect.ts` — 4 exports (KEY, set, clear, is) | ✅ ตรงทุกบรรทัด |
| `Const.ts` — เปลี่ยน `silent_redirect_uri` → `silent-callback.html` | ✅ ตรง |
| `Callback.tsx` — `processSigninCallback` + `processSilentCallback` + URL routing | ✅ ตรงทุก block |
| `AuthProvider.tsx` — `signinRedirectWithGuard` + `signinSilentThenRedirect` | ✅ ตรง |
| `AuthProvider.tsx` — event listeners ใน `useEffect` พร้อม cleanup | ✅ ตรง |
| `SigninCallback.tsx` — guard ใน catch + `finally` clear | ✅ ตรง |
| `SilentCallback.tsx` — try/finally + clear + clearStaleState | ✅ ตรง |
| `silent-callback.html` — HTML entry point | ✅ ตรง |
| `public/web.config` — `<location path="silent-callback.html">` DisableCache | ✅ ตรง |
| `vite.config.ts` — เพิ่ม `"silent-callback"` input | ✅ ตรง |

**ผล:** 10/10 snippets ตรงกับ PR diff

---

### ✅ `ssd-bug-std-version-checker` — PASS

| Code snippet ใน skill | ตรงกับ PR diff? |
|----------------------|----------------|
| `vite.config.ts` — `chunkFileNames: [name].[hash].js` | ✅ ตรง |
| 3 refs: `isCheckingRef`, `isPromptOpenRef`, `isReloadingRef` | ✅ ตรง |
| Guard ต้น `getData()`: check 3 refs ก่อน | ✅ ตรง |
| `fetch` เพิ่ม `cache: "no-store"` | ✅ ตรง |
| `emptyCache` เป็น async + `Promise.all` + await ก่อน reload | ✅ ตรง |
| `isReloadingRef.current = true` ก่อน try block | ✅ ตรง |
| `swalConfirm` ใช้ await แทน `.then()` | ✅ ตรง |
| `console.error` แทน `alert()` | ✅ ตรง |
| `void getData()` ใน `useEffect` | ✅ ตรง |

**ผล:** 9/9 snippets ตรงกับ PR diff

---

## Category E: Generation & Starter (2 skills)

### ⚠️ `ssd-contact-skill-gen` — WARNING

**Simulation:** Mock SMS Gateway setup document → generate SKILL.md

**Input:** "SMSGateway.Shared.dll จาก private GitHub `SiamsmileDev/SMSGatewayAPI` v1.0.0 — register `SendSmsMessage` request client"

**Following skill steps:**
1. ✅ วิเคราะห์ข้อมูลพื้นฐาน: ชื่อ library, source, version, clients ครบ
2. ✅ การติดตั้ง: `gh release download`, path rules, cleanup steps ครบ
3. ✅ การตั้งค่า: .csproj, appsettings.json, ProjectSetup.cs patterns ครบ
4. ✅ YAML frontmatter template ถูก format
5. ✅ Tier structure ถูก (ตาม lineoa-contact example)

**WARNING:** ตัวอย่าง LineOAPA ที่ฝังอยู่ท้าย skill มีการ escape backticks (`\`\`\``) ภายใน outer code block — อาจทำให้ AI agent บางตัวอ่าน markdown rendering ไม่ถูกต้อง ควรแก้ไขโครงสร้างการฝัง example

**ผล:** Logic ถูกต้อง แต่ markdown structure มี edge case ⚠️

---

### ✅ `ssd-python-starter` — PASS

**Simulation:** สร้าง `products` bounded context ตาม skill

**Following skill — ระยะที่ 3 (9 ขั้นตอน):**

| ขั้น | Output | ถูกต้อง? |
|-----|--------|---------|
| 1 | `app/domain/products/entities.py` — `Product` dataclass + `ProductStatus` StrEnum | ✅ |
| 2 | `app/domain/products/ports.py` — `ProductRepository` Protocol | ✅ |
| 3 | `app/application/product_service.py` — constructor injection, keyword-only args | ✅ |
| 4 | `app/infrastructure/db/models.py` — `ProductRow` + `CheckConstraint` + `Index` | ✅ |
| 5 | `app/infrastructure/db/products_repository.py` — `_to_domain`/`_to_row` + async SQLAlchemy 2.x | ✅ |
| 6 | `alembic/versions/` — migration พร้อม `downgrade()` | ✅ |
| 7 | `app/api/products.py` — GET/POST only + Request/Response DTOs + `from_domain()` | ✅ |
| 8 | `app/api/deps.py` — `get_product_service()` factory | ✅ |
| 9 | `app/main.py` — register router ใน lifespan | ✅ |

**ผล:** 9/9 ขั้นตอนถูกต้อง ครบ pattern ทุกชั้น

---

## สรุปผล Issues ที่พบ

### ⚠️ Issues ที่ควรแก้ไข

| # | Skill | Issue | ความรุนแรง |
|---|-------|-------|-----------|
| 1 | `ssd-contact-skill-gen` | Embedded example มี escaped backticks ซ้อนกัน อาจ render ผิดใน AI บางตัว | Medium |
| 2 | `ssd-backend-review` | ไม่มี checklist สำหรับ GET/POST only rule — แต่นี่อาจถูกต้องแล้ว เพราะ policy นี้ระบุชัดเฉพาะ Python (cursor rules) ไม่ใช่ .NET | Low / By Design |

### ✅ ไม่พบปัญหาสำคัญ

- Skills ทั้งหมดระบุ violations ได้ถูกต้องบน sample code
- Tier classification ถูกต้องทุก skill (Tier 4 สำหรับ route/schema changes)
- Code snippets ใน bug-fix skills ตรงกับ PR diff 100%
- Standard knowledge questions ตอบถูกทุกข้อ
- Python starter ครบทุกชั้นในลำดับที่ถูกต้อง

---

## Recommended Fix

**สำหรับ `ssd-contact-skill-gen`:** แยก LineOAPA example ออกจาก code block ใหญ่ หรือใช้ section แยกต่างหากแทนการ embed ซ้อนกัน
