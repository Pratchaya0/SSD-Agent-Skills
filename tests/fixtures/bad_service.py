# TEST FIXTURE: bad_service.py
# ไฟล์นี้มี violations จงใจสำหรับ test ssd-python-review และ ssd-python-refactor
# Expected violations: 8 รายการ

# VIOLATION 1: domain file import FastAPI (HTTPException)
from fastapi import HTTPException
from uuid import UUID
from sqlalchemy.orm import Session
from apscheduler.schedulers.asyncio import AsyncIOScheduler

# VIOLATION 2: module-level session
from app.infrastructure.db.session import SessionLocal
session = SessionLocal()

from app.infrastructure.db.models import OrderRow


class OrderService:
    def __init__(self, session: Session):
        self.session = session  # ไม่มี _ prefix

    async def get_order(self, order_id: UUID):
        # VIOLATION 3: ใช้ print แทน log
        print(f"Getting order {order_id}")

        row = self.session.query(OrderRow).filter(OrderRow.id == order_id).first()

        if row is None:
            # VIOLATION 4: raise HTTPException ใน service layer (ควรเป็น DomainError)
            raise HTTPException(status_code=404, detail="Order not found")

        # VIOLATION 5: return ORM row แทน domain entity
        return row

    async def list_orders(self):
        try:
            rows = self.session.query(OrderRow).all()
            return rows  # VIOLATION 5 (ซ้ำ): return ORM rows
        except Exception as e:
            # VIOLATION 6: log.error(str(e)) แทน log.exception()
            print(f"Error: {str(e)}")
            raise


# VIOLATION 7: business logic ใน router (ตัวอย่าง)
from fastapi import APIRouter, Depends
router = APIRouter()

@router.delete("/orders/{order_id}")  # VIOLATION 8: ใช้ DELETE verb
async def delete_order(order_id: UUID):
    row = session.query(OrderRow).filter(OrderRow.id == order_id).first()
    if row:
        session.delete(row)
        session.commit()
    return {"deleted": True}


# Scheduler job ที่ไม่ถูกต้อง
scheduler = AsyncIOScheduler()

async def cleanup_job():
    # VIOLATION: business logic ใน job แทนที่จะเรียก service
    rows = session.query(OrderRow).filter(OrderRow.status == "done").all()
    for row in rows:
        session.delete(row)
    session.commit()

# VIOLATION 9: ไม่มี coalesce, max_instances, misfire_grace_time
scheduler.add_job(
    cleanup_job,
    trigger="cron",
    hour=2,
    id="orders.cleanup.daily",
)
