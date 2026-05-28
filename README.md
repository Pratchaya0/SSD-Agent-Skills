# SSD Agent Skills

คอลเลกชัน Agent Skills สำหรับทีมพัฒนาของ Smile Solution Development จาก SIAM SMILE WEB SPECIFICATION v2.0.1

## วิธีใช้งาน

ติดตั้ง skill ที่ต้องการด้วยคำสั่ง:

```bash
npx skills add <github-repo-url>/skills/<skill-name>
```

## Skills ที่มีให้ใช้

| Skill | ใช้เมื่อ |
|-------|----------|
| `ssd-frontend-setup` | ตั้งค่าโปรเจค Frontend ใหม่, โครงสร้าง folder, เครื่องมือ, naming conventions |
| `ssd-react-component` | เขียน React component, ตั้งชื่อ component/props/page |
| `ssd-react-form` | ใช้งาน Formik สำหรับ form, validation |
| `ssd-react-state` | ใช้งาน Redux, สร้าง slice, dispatch action |
| `ssd-react-api` | เรียก API ด้วย Axios, React Query, NSwag |
| `ssd-backend-setup` | ตั้งค่าโปรเจค .NET ใหม่, โครงสร้าง folder, naming conventions |
| `ssd-dotnet-controller` | เขียน ASP.NET API Controller |
| `ssd-dotnet-service` | เขียน Service, DTO, AutoMapper |
| `ssd-dotnet-infra` | Logging (Serilog), Background jobs (Quartz), API client (RestSharp) |
| `ssd-database` | กำหนดชื่อ database objects, EF Core Reverse Engineer |
| `ssd-git-commit` | เขียน commit message, semantic versioning |
| `ssd-git-flow` | Git Flow workflow, branch naming, pull request |
| `ssd-contact-skill-gen` | แปลง setup document ของ shared library หรือ contact service ใหม่เป็น SKILL.md มาตรฐาน SSD |
| `ssd-frontend-review` | ตรวจสอบ code React/TypeScript ว่าตรง SSD standard — รายงาน violations พร้อม file:line |
| `ssd-backend-review` | ตรวจสอบ code C#/.NET ว่าตรง SSD standard — รายงาน violations พร้อม file:line |
| `ssd-frontend-refactor` | แก้ไข .tsx/.ts ให้ตรง standard อย่างปลอดภัย ทีละไฟล์ + TypeScript compile check |
| `ssd-backend-refactor` | แก้ไข .cs ให้ตรง standard อย่างปลอดภัย ทีละไฟล์ + dotnet build check |
| `ssd-bug-std-auth-redirect-loop` | แก้ bug หน้าขาว / redirect loop หลัง login (oidc-client-ts, react-ts-template-2023) |
| `ssd-bug-std-version-checker` | แก้ bug ไม่เห็น version ใหม่หลัง deploy — JS chunk cache + VersionChecker race condition |

## อ้างอิง

SIAM SMILE WEB SPECIFICATION v2.0.1 — Smile Solution Development Co., Ltd.
