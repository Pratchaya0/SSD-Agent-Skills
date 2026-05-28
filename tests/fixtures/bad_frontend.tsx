// TEST FIXTURE: bad_frontend.tsx
// ไฟล์นี้มี violations จงใจสำหรับ test ssd-frontend-review และ ssd-frontend-refactor
// Expected violations: 8 รายการ

import React, { useState } from "react";
import axios from "axios";

// VIOLATION 1: Props type ไม่ได้ตั้งชื่อตาม [Name]Props
interface Props {
    items: any[];  // VIOLATION 2: ใช้ `any`
    onSelect: (item: any) => void;  // VIOLATION 2 (ซ้ำ): ใช้ `any`
}

// VIOLATION (naming): component name > 3 words — แต่ผ่านได้เพราะ PascalCase ถูก
const OrderItemListDisplayComponent = ({ items, onSelect }: Props) => {
    const [searchText, setSearchText] = useState<string>("");
    const [data, setData] = useState<any>(null);  // VIOLATION 2: ใช้ `any`

    // VIOLATION 3: axios ใน component แทน useQuery
    const fetchData = async () => {
        const res = await axios.get(
            `${import.meta.env.VITE_API_URL}/orders`  // VIOLATION 4: ใช้ import.meta.env
        );
        setData(res.data);
    };

    // VIOLATION 5: ใช้ index เป็น key
    const renderItems = items.map((item, index) => (
        <div key={index} onClick={() => onSelect(item)}>
            {item.name}
        </div>
    ));

    return (
        // VIOLATION 6: ใช้ React.Fragment แทน <>
        <React.Fragment>
            <input
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
            />
            {/* VIOLATION 7: form ใช้ useState+onChange แทน Formik */}
            <form onSubmit={(e) => {
                e.preventDefault();
                // raw form handling
            }}>
                <input
                    name="title"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                />
                {/* VIOLATION 8: Button ไม่มี name attribute */}
                <button type="submit" disabled={true}>ค้นหา</button>
            </form>
            {renderItems}
        </React.Fragment>
    );
};

export default OrderItemListDisplayComponent;
