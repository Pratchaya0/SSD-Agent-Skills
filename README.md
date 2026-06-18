# SSD Agent Skills

คอลเลกชัน Agent Skills สำหรับทีมพัฒนาของ Smile Solution Development จาก SIAM SMILE WEB SPECIFICATION v2.0.1

1 skill, 23 commands — React/TypeScript, .NET Core, Python, Git

## ติดตั้ง

### วิธีที่แนะนำ — ติดตั้งครั้งเดียวได้ทุก command

```bash
npx skills add github:Pratchaya0/SSD-Agent-Skills/.claude/skills/ssd
```

ได้ `/ssd` command เดียวในเมนู พร้อมใช้ 23 sub-commands ทันที

### ติดตั้งเฉพาะบาง skill (แบบเดิม)

```bash
npx skills add github:Pratchaya0/SSD-Agent-Skills/skills/ssd-frontend-setup
npx skills add github:Pratchaya0/SSD-Agent-Skills/skills/ssd-git-commit
# ... ทีละ skill
```

## อัปเดต

โปรเจคที่ติดตั้ง `/ssd` ไปแล้วจะมีไฟล์ `skills-lock.json` เก็บ source + hash ไว้ — รันคำสั่งนี้ในโปรเจคนั้นเพื่อดึงเวอร์ชันล่าสุดจาก GitHub:

```bash
npx skills update ssd      # อัปเดตเฉพาะ skill ssd
npx skills update          # อัปเดตทุก skill ที่ติดตั้งไว้ในโปรเจค
```

คำสั่งนี้เทียบ `computedHash` ใน `skills-lock.json` กับเวอร์ชันล่าสุดบน GitHub แล้วเขียนไฟล์ skill ทับถ้ามีการเปลี่ยนแปลง — commit ไฟล์ที่เปลี่ยน (รวม `skills-lock.json`) ในโปรเจคนั้นตามปกติ

## วิธีใช้งาน

```
/ssd frontend-setup     ตั้งค่าโปรเจค React/TypeScript ใหม่
/ssd git-commit         เขียน commit message ตามมาตรฐาน
/ssd python-review      review Python code
```

หรือพิมพ์ `/ssd` เพื่อดูรายการ commands ทั้งหมด

## Commands ที่มี (23 commands)

### เริ่มต้นโปรเจคใหม่

| Command | ใช้เมื่อ |
|---------|----------|
| `/ssd frontend-init` | เริ่มโปรเจค Frontend ใหม่จาก react-ts-template-2023 v1.2.0 |
| `/ssd backend-init` | เริ่มโปรเจค Backend ใหม่จาก Net60_ApiTemplate_2023 (202306) |

### Frontend (React + TypeScript)

| Command | ใช้เมื่อ |
|---------|----------|
| `/ssd frontend-setup` | ตั้งค่าโปรเจค Frontend ใหม่, โครงสร้าง folder, เครื่องมือ, naming conventions |
| `/ssd react-component` | เขียน React component, ตั้งชื่อ component/props/page |
| `/ssd react-form` | ใช้งาน Formik สำหรับ form, validation |
| `/ssd react-state` | ใช้งาน Redux, สร้าง slice, dispatch action |
| `/ssd react-api` | เรียก API ด้วย Axios, React Query, NSwag |

### Backend (.NET Core)

| Command | ใช้เมื่อ |
|---------|----------|
| `/ssd backend-setup` | ตั้งค่าโปรเจค .NET ใหม่, โครงสร้าง folder, naming conventions |
| `/ssd dotnet-controller` | เขียน ASP.NET API Controller |
| `/ssd dotnet-service` | เขียน Service, DTO, AutoMapper |
| `/ssd dotnet-infra` | Logging (Serilog), Background jobs (Quartz), API client (RestSharp) |
| `/ssd database` | กำหนดชื่อ database objects, EF Core Reverse Engineer |

### Python

| Command | ใช้เมื่อ |
|---------|----------|
| `/ssd python-starter` | เริ่มต้น Python project ใหม่จาก SSD-Python-Starter-Template |
| `/ssd python-review` | ตรวจสอบ code Python — Architecture, HTTP methods, logging, DB, error handling |
| `/ssd python-refactor` | แก้ไข .py ให้ตรง standard อย่างปลอดภัย + pytest verify |
| `/ssd python-database` | PostgreSQL + SQLAlchemy 2.x: naming, ORM models, async session, Alembic migration |

### TypeScript

| Command | ใช้เมื่อ |
|---------|----------|
| `/ssd ts-fix-unused` | แก้ TS6133/TS6196 build errors อัตโนมัติ — @ts-nocheck สำหรับ NSwag files, @ts-ignore สำหรับ manual code |

### Review & Refactor

| Command | ใช้เมื่อ |
|---------|----------|
| `/ssd frontend-review` | ตรวจสอบ code React/TypeScript — รายงาน violations พร้อม file:line |
| `/ssd backend-review` | ตรวจสอบ code C#/.NET — รายงาน violations พร้อม file:line |
| `/ssd frontend-refactor` | แก้ไข .tsx/.ts อย่างปลอดภัย ทีละไฟล์ + TypeScript compile check |
| `/ssd backend-refactor` | แก้ไข .cs อย่างปลอดภัย ทีละไฟล์ + dotnet build check |

### Git & Release

| Command | ใช้เมื่อ |
|---------|----------|
| `/ssd git-commit` | เขียน commit message, semantic versioning |
| `/ssd git-flow` | Git Flow workflow, branch naming, pull request |
| `/ssd release-it-setup` | ติดตั้ง release-it + สร้าง CHANGELOG.md + GitHub Draft Release อัตโนมัติ |

### Specialized

| Command | ใช้เมื่อ |
|---------|----------|
| `/ssd contact-skill-gen` | แปลง setup document ของ shared library เป็น SKILL.md มาตรฐาน SSD |
| `/ssd bug-auth-redirect` | แก้ bug หน้าขาว / redirect loop หลัง login (oidc-client-ts) |
| `/ssd bug-version-checker` | แก้ bug ไม่เห็น version ใหม่หลัง deploy — JS chunk cache race condition |

## อ้างอิง

SIAM SMILE WEB SPECIFICATION v2.0.1 — Smile Solution Development Co., Ltd.
