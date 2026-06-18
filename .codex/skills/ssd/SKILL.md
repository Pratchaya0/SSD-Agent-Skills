---
name: ssd
description: "มาตรฐานการพัฒนาซอฟต์แวร์ของทีม SSD: React/TypeScript, .NET Core, Python, Git — ใช้เมื่อเขียนโค้ด, review, refactor, ตั้งค่าโปรเจค, หรือถามเรื่อง conventions ของ Smile Solution Development"
---

# SSD Agent Skills

คุณคือ AI assistant ที่ช่วยทีม Smile Solution Development (SSD) เขียนโค้ดตามมาตรฐานของทีม

## วิธีใช้

พิมพ์ `$ssd <command>` เพื่อเรียกใช้คำสั่ง เช่น:
- `$ssd frontend-setup` — ตั้งค่าโปรเจค React/TypeScript
- `$ssd git-commit` — เขียน commit message ตามมาตรฐาน
- `$ssd python-review` — review Python code

## คำสั่งที่มี (31 commands)

### Frontend (React + TypeScript)

| Command | รายละเอียด |
|---------|-----------|
| `frontend-init` | เริ่มโปรเจค Frontend ใหม่จาก react-ts-template-2023 v1.2.0 |
| `backend-init` | เริ่มโปรเจค Backend ใหม่จาก Net60_ApiTemplate_2023 (202306) |
| `frontend-setup` | ตั้งค่าโปรเจค React/TS ใหม่ — folder structure, tools, naming conventions |
| `react-component` | มาตรฐาน React functional component, Props typing, hooks |
| `react-form` | Formik form implementation กับ MUI |
| `react-state` | Redux slice, dispatch patterns |
| `react-api` | API client ด้วย Axios, React Query, NSwag |

### Backend (.NET Core)

| Command | รายละเอียด |
|---------|-----------|
| `backend-setup` | ตั้งค่าโปรเจค ASP.NET Core 6 ใหม่ |
| `dotnet-controller` | ASP.NET API controllers, routing, authorization |
| `dotnet-service` | Service layer, DTO, AutoMapper |
| `dotnet-infra` | Serilog logging, Quartz jobs, RestSharp HTTP clients |
| `database` | EF Core Reverse Engineer, database naming conventions |

### Python

| Command | รายละเอียด |
|---------|-----------|
| `python-starter` | เริ่มโปรเจค FastAPI ใหม่ด้วย Clean Architecture |
| `python-review` | Review Python code (architecture, HTTP methods, logging, SQLAlchemy) |
| `python-refactor` | Refactor .py files อย่างปลอดภัยพร้อม pytest |
| `python-database` | PostgreSQL + SQLAlchemy 2.x: naming, ORM models, Alembic migration |

### Review & Refactor

| Command | รายละเอียด |
|---------|-----------|
| `ts-fix-unused` | แก้ TS6133/TS6196 build errors — @ts-nocheck สำหรับ NSwag files, @ts-ignore สำหรับ manual code |
| `frontend-review` | Review React/TypeScript code |
| `backend-review` | Review C#/.NET code |
| `frontend-refactor` | Refactor .tsx/.ts files อย่างปลอดภัย |
| `backend-refactor` | Refactor .cs files อย่างปลอดภัย |

### Git & Release

| Command | รายละเอียด |
|---------|-----------|
| `git-commit` | Conventional Commits, Semantic Versioning |
| `git-flow` | Git Flow workflow, branch naming, pull request standards |
| `release-it-setup` | ตั้งค่า release-it สำหรับ automated GitHub releases |

### Specialized

| Command | รายละเอียด |
|---------|-----------|
| `contact-skill-gen` | สร้าง SKILL.md สำหรับ shared libraries |
| `bug-auth-redirect` | แก้ white screen / auth redirect loop |
| `bug-version-checker` | แก้ version cache race condition |

### Doctor (Project Health)

| Command | รายละเอียด |
|---------|-----------|
| `frontend-doctor` | ตรวจสุขภาพโปรเจค React/TypeScript — dependencies, config, folder structure, ENV pattern |
| `backend-doctor` | ตรวจสุขภาพโปรเจค ASP.NET Core — NuGet packages, middleware pipeline, appsettings |
| `python-doctor` | ตรวจสุขภาพโปรเจค FastAPI — dependencies, Clean Architecture layers, main.py wiring |
| `db-doctor` | ตรวจสุขภาพ Database schema — standard columns, datetime2, naming, SP prefix |

## วิธีตอบสนองต่อคำสั่ง

เมื่อผู้ใช้พิมพ์ `$ssd <command>`:

1. **ตรงกับคำสั่งใดคำสั่งหนึ่งทั้งหมด (exact match)** — โหลดไฟล์ reference ที่ตรงกันจาก `reference/<command>.md`, ปฏิบัติตามมาตรฐาน SSD ที่ระบุในไฟล์นั้นทุกข้อ, เขียนโค้ดตาม conventions ที่กำหนดเท่านั้น ห้ามเบี่ยงเบน
2. **ไม่ได้ระบุคำสั่ง หรือพิมพ์ `help` / `--help`** — แสดงรายการคำสั่งทั้งหมดข้างต้น (จัดกลุ่มตามหมวด) แล้วถามว่าต้องการใช้คำสั่งใด
3. **พิมพ์ไม่ครบ/ไม่ตรงกับคำสั่งใดเลย (partial)** — ค้นหาคำสั่งทั้งหมดที่ "ขึ้นต้น" ด้วยข้อความที่พิมพ์ (prefix match, ไม่สนตัวพิมพ์เล็ก/ใหญ่) เช่น พิมพ์ `dotn` จะตรงกับ `dotnet-controller`, `dotnet-service`, `dotnet-infra`:
   - **เจอ 1 คำสั่ง** — แนะนำคำสั่งนั้นทันที พร้อมคำอธิบายสั้นๆ และบรรทัด "ลองพิมพ์: `$ssd <command>`"
   - **เจอมากกว่า 1 คำสั่ง** — แสดงเฉพาะคำสั่งที่ตรง (ไม่ใช่ทั้ง 31 คำสั่ง) พร้อมคำอธิบาย แล้วใช้ AskUserQuestion ถามผู้ใช้ว่าต้องการคำสั่งใดจากรายการที่ตรงนั้น
   - **ไม่เจอเลย** — fallback กลับไปแสดงรายการคำสั่งทั้งหมดและถามว่าต้องการใช้คำสั่งใด (เหมือนข้อ 2)

## บริบทร่วม (Shared Standards)

มาตรฐานเหล่านี้ใช้กับทุก skill:

**Stack หลัก:**
- Frontend: React 18.2 + TypeScript + Vite 4.3.9 + MUI v5
- Backend: ASP.NET Core 6 + Entity Framework Core 6
- Python: FastAPI + SQLAlchemy 2.x + Clean/Hexagonal Architecture

**Encoding:** UTF-8, line ending CRLF (Windows)

**Naming:**
- TypeScript: PascalCase (class/component), camelCase (var/func), CONSTANT_CASE (constants)
- C#: PascalCase (class/method), camelCase (local), `_camelCase` (private field)
- Python: snake_case (func/var), PascalCase (class)

**ข้อห้ามสากล:**
- ห้ามใช้ `any` type ใน TypeScript
- ห้ามใช้ f-string ใน logging (Python)
- ห้าม DELETE/PUT/PATCH ใน API ทุก stack (C#/.NET, Python) — มาตรฐานบริษัทใช้ REST API ไม่ใช่ RESTful มี HTTP method แค่ GET กับ POST เท่านั้น ใช้ POST + action path เช่น `{id}/update`, `{id}/delete`

config file: AGENTS.md