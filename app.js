// BrewCost Pro Application State & Logic
document.addEventListener('DOMContentLoaded', () => {

    // Safely get item from localStorage with error catching
    function safeStorageGet(key, fallback = null) {
        try {
            const item = localStorage.getItem(key);
            return item !== null && item !== undefined ? item : fallback;
        } catch (e) {
            return fallback;
        }
    }

    // Safely set item in localStorage with error catching
    function safeStorageSet(key, value) {
        try {
            localStorage.setItem(key, value);
        } catch (e) {
            console.warn(`LocalStorage set error for ${key}:`, e);
        }
    }

    // Safely parse JSON from localStorage with fallbacks
    function safeJSONParse(key, fallback) {
        try {
            const item = safeStorageGet(key);
            if (!item) return fallback;
            const parsed = JSON.parse(item);
            return parsed !== null && parsed !== undefined ? parsed : fallback;
        } catch (e) {
            return fallback;
        }
    }

    function loadRichSampleData(showAlert = true) {
        const sampleMaster = [
            { id: 'm1', name: "เมล็ดกาแฟคั่ว (Specialty Blend 500g)", price: 450, packQty: 500, packUnit: "กรัม" },
            { id: 'm2', name: "นมสดพาสเจอร์ไรส์ 2,000ml", price: 95, packQty: 2000, packUnit: "มล." },
            { id: 'm3', name: "นมข้นหวาน/นมข้นจืด 380g", price: 55, packQty: 380, packUnit: "มล." },
            { id: 'm4', name: "ผงมัทฉะเกรดพิธีการ 100g", price: 550, packQty: 100, packUnit: "กรัม" },
            { id: 'm5', name: "ผงโกโก้ดัทช์ 100% 500g", price: 180, packQty: 500, packUnit: "กรัม" },
            { id: 'm6', name: "ไซรัปพีชพรีเมียม 700ml", price: 320, packQty: 700, packUnit: "มล." },
            { id: 'm7', name: "น้ำเชื่อมแท้ 750ml", price: 120, packQty: 750, packUnit: "มล." },
            { id: 'm8', name: "โซดา Singha (แพ็ค 24 ขวด)", price: 240, packQty: 7800, packUnit: "มล." },
            { id: 'm9', name: "น้ำแข็งยูนิค 15kg", price: 60, packQty: 15000, packUnit: "กรัม" },
            { id: 'm10', name: "แก้วพลาสติก 16oz + ฝาฮาฟ (100 ชิ้น)", price: 220, packQty: 100, packUnit: "ชิ้น" },
            { id: 'm11', name: "หลอด + ปลอกแก้ว + สติ๊กเกอร์ (100 ชุด)", price: 90, packQty: 100, packUnit: "ชุด" }
        ];

        const sampleCurrentIngredients = [
            { id: 1, masterId: 'm1', name: "เมล็ดกาแฟคั่ว (Specialty Blend 500g)", price: 450, packQty: 500, packUnit: "กรัม", useQty: 18.5, useUnit: "กรัม", isPackage: false },
            { id: 2, masterId: 'm2', name: "นมสดพาสเจอร์ไรส์ 2,000ml", price: 95, packQty: 2000, packUnit: "มล.", useQty: 120, useUnit: "มล.", isPackage: false },
            { id: 3, masterId: 'm3', name: "นมข้นหวาน/นมข้นจืด 380g", price: 55, packQty: 380, packUnit: "มล.", useQty: 15, useUnit: "มล.", isPackage: false },
            { id: 4, masterId: 'm9', name: "น้ำแข็งยูนิค 15kg", price: 60, packQty: 15000, packUnit: "กรัม", useQty: 200, useUnit: "กรัม", isPackage: false },
            { id: 5, masterId: 'm10', name: "แก้วพลาสติก 16oz + ฝาฮาฟ (100 ชิ้น)", price: 220, packQty: 100, packUnit: "ชิ้น", useQty: 1, useUnit: "ชิ้น", isPackage: true },
            { id: 6, masterId: 'm11', name: "หลอด + ปลอกแก้ว + สติ๊กเกอร์ (100 ชุด)", price: 90, packQty: 100, packUnit: "ชุด", useQty: 1, useUnit: "ชุด", isPackage: true }
        ];

        const sampleOverheads = [
            { id: 1, name: "ค่าเช่าสถานที่ร้านกาแฟ", amount: 15000 },
            { id: 2, name: "เงินเดือนบาริสต้า (2 คน)", amount: 28000 },
            { id: 3, name: "ค่าน้ำ ค่าไฟ ค่าอินเทอร์เน็ต", amount: 6500 },
            { id: 4, name: "ค่าการตลาด / ยิงแอด Facebook Line OA", amount: 2500 },
            { id: 5, name: "ค่าระบบ POS & อินเทอร์เน็ต", amount: 800 }
        ];

        const sampleInvestments = [
            { id: 1, name: "เครื่องชงกาแฟเอสเพรสโซ่ 2 หัวชง (Commercial)", amount: 85000 },
            { id: 2, name: "เครื่องบดกาแฟไฟฟ้า On-Demand", amount: 25000 },
            { id: 3, name: "ค่าตกแต่งร้าน / เคาน์เตอร์บาร์ / เฟอร์นิเจอร์", amount: 65000 },
            { id: 4, name: "ตู้เย็น / เครื่องทำน้ำแข็ง / อุปกรณ์บาร์", amount: 32000 },
            { id: 5, name: "ระบบ POS / กล้องวงจรปิด / ป้ายไฟร้าน", amount: 13000 }
        ];

        const sampleSavedRecipes = [
            {
                id: 101,
                name: "กาแฟลาเต้เย็น (Iced Latte 16oz)",
                category: "กาแฟ",
                cogs: 29.47,
                sellingPrice: 65,
                grossProfit: 35.53,
                foodCostPercent: 45.3,
                deliveryPrice: 96,
                salesMix: 35,
                dose: "18.5 กรัม",
                yield: "36 มล.",
                shotTime: "26 วินาที",
                temp: "93°C",
                steps: [
                    "ชั่งเมล็ดกาแฟ 18.5 กรัม บดปรับเบอร์สกัดมาตรฐานร้าน",
                    "กดเกลี่ยและแทมป์กาแฟ สกัดเอสเพรสโซ่ช็อต 36 มล. ในเวลา 26 วินาที",
                    "ตวงนมสด 120 มล. และนมข้นหวาน 15 มล. ใส่แก้วแล้วคนให้เข้ากัน",
                    "ตักน้ำแข็งเต็มแก้ว 16oz แล้วเทเอสเพรสโซ่ช็อตท็อปด้านบน"
                ],
                ingredients: sampleCurrentIngredients
            },
            {
                id: 102,
                name: "อเมริกาโน่เย็น (Iced Americano 16oz)",
                category: "กาแฟ",
                cogs: 19.80,
                sellingPrice: 55,
                grossProfit: 35.20,
                foodCostPercent: 36.0,
                deliveryPrice: 81,
                salesMix: 25,
                dose: "18.0 กรัม",
                yield: "36 มล.",
                shotTime: "25 วินาที",
                temp: "93°C",
                steps: [
                    "สกัดเอสเพรสโซ่ดับเบิลช็อต 36 มล. จากเมล็ดกาแฟคั่วกลาง 18g",
                    "ใส่น้ำเปล่ากรองสะอาด 120 มล. ลงในแก้ว 16oz",
                    "ตักน้ำแข็งเต็มแก้ว แล้วราดเอสเพรสโซ่ช็อตท็อปด้านบน"
                ],
                ingredients: [
                    { id: 1, name: "เมล็ดกาแฟคั่ว (Specialty Blend 500g)", price: 450, packQty: 500, packUnit: "กรัม", useQty: 18, useUnit: "กรัม", isPackage: false },
                    { id: 2, name: "น้ำเปล่ากรองสะอาด", price: 10, packQty: 18000, packUnit: "มล.", useQty: 120, useUnit: "มล.", isPackage: false },
                    { id: 3, name: "น้ำแข็งยูนิค 15kg", price: 60, packQty: 15000, packUnit: "กรัม", useQty: 200, useUnit: "กรัม", isPackage: false },
                    { id: 4, name: "แก้วพลาสติก 16oz + ฝาฮาฟ (100 ชิ้น)", price: 220, packQty: 100, packUnit: "ชิ้น", useQty: 1, useUnit: "ชิ้น", isPackage: true },
                    { id: 5, name: "หลอด + ปลอกแก้ว + สติ๊กเกอร์ (100 ชุด)", price: 90, packQty: 100, packUnit: "ชุด", useQty: 1, useUnit: "ชุด", isPackage: true }
                ]
            },
            {
                id: 103,
                name: "มัทฉะลาเต้พรีเมียม (Matcha Latte 16oz)",
                category: "ชา",
                cogs: 38.50,
                sellingPrice: 75,
                grossProfit: 36.50,
                foodCostPercent: 51.3,
                deliveryPrice: 111,
                salesMix: 15,
                dose: "5.0 กรัม",
                yield: "40 มล.",
                shotTime: "-",
                temp: "80°C",
                steps: [
                    "ตวงผงมัทฉะ 5g ใส่น้ำร้อน 40ml (80°C) ตีด้วยแปรงไม้ไผ่จนละลายโฟมเนียน",
                    "ผสมนมสด 150ml กับน้ำเชื่อม 15ml ลงในแก้ว",
                    "ตักน้ำแข็งเต็มแก้ว เทซอสมัทฉะท็อปเลเยอร์ด้านบนแยกชั้นสวยงาม"
                ],
                ingredients: [
                    { id: 1, name: "ผงมัทฉะเกรดพิธีการ 100g", price: 550, packQty: 100, packUnit: "กรัม", useQty: 5, useUnit: "กรัม", isPackage: false },
                    { id: 2, name: "นมสดพาสเจอร์ไรส์ 2,000ml", price: 95, packQty: 2000, packUnit: "มล.", useQty: 150, useUnit: "มล.", isPackage: false },
                    { id: 3, name: "น้ำเชื่อมแท้ 750ml", price: 120, packQty: 750, packUnit: "มล.", useQty: 15, useUnit: "มล.", isPackage: false },
                    { id: 4, name: "น้ำแข็งยูนิค 15kg", price: 60, packQty: 15000, packUnit: "กรัม", useQty: 200, useUnit: "กรัม", isPackage: false },
                    { id: 5, name: "แก้วพลาสติก 16oz + ฝาฮาฟ (100 ชิ้น)", price: 220, packQty: 100, packUnit: "ชิ้น", useQty: 1, useUnit: "ชิ้น", isPackage: true },
                    { id: 6, name: "หลอด + ปลอกแก้ว + สติ๊กเกอร์ (100 ชุด)", price: 90, packQty: 100, packUnit: "ชุด", useQty: 1, useUnit: "ชุด", isPackage: true }
                ]
            },
            {
                id: 104,
                name: "โกโก้เย็นเข้มข้น (Dark Cocoa 16oz)",
                category: "นม / โกโก้",
                cogs: 22.10,
                sellingPrice: 60,
                grossProfit: 37.90,
                foodCostPercent: 36.8,
                deliveryPrice: 89,
                salesMix: 12,
                dose: "20.0 กรัม",
                yield: "50 มล.",
                shotTime: "-",
                temp: "85°C",
                steps: [
                    "ชงผงโกโก้ดัทช์ 20g กับน้ำร้อน 50ml คนจนละลายเนียน",
                    "เติมนมสด 100ml นมข้นหวาน 20ml และนมข้นจืด 15ml คนให้เข้ากัน",
                    "ตักน้ำแข็งเต็มแก้ว เทราดซอสโกโก้เข้มข้นท็อปด้านบน"
                ],
                ingredients: [
                    { id: 1, name: "ผงโกโก้ดัทช์ 100% 500g", price: 180, packQty: 500, packUnit: "กรัม", useQty: 20, useUnit: "กรัม", isPackage: false },
                    { id: 2, name: "นมสดพาสเจอร์ไรส์ 2,000ml", price: 95, packQty: 2000, packUnit: "มล.", useQty: 100, useUnit: "มล.", isPackage: false },
                    { id: 3, name: "นมข้นหวาน/นมข้นจืด 380g", price: 55, packQty: 380, packUnit: "มล.", useQty: 20, useUnit: "มล.", isPackage: false },
                    { id: 4, name: "น้ำแข็งยูนิค 15kg", price: 60, packQty: 15000, packUnit: "กรัม", useQty: 200, useUnit: "กรัม", isPackage: false },
                    { id: 5, name: "แก้วพลาสติก 16oz + ฝาฮาฟ (100 ชิ้น)", price: 220, packQty: 100, packUnit: "ชิ้น", useQty: 1, useUnit: "ชิ้น", isPackage: true },
                    { id: 6, name: "หลอด + ปลอกแก้ว + สติ๊กเกอร์ (100 ชุด)", price: 90, packQty: 100, packUnit: "ชุด", useQty: 1, useUnit: "ชุด", isPackage: true }
                ]
            },
            {
                id: 105,
                name: "ชาพีชโซดาเย็น (Iced Peach Soda 16oz)",
                category: "สมูทตี้ / โซดา",
                cogs: 18.20,
                sellingPrice: 65,
                grossProfit: 46.80,
                foodCostPercent: 28.0,
                deliveryPrice: 96,
                salesMix: 8,
                dose: "30 มล.",
                yield: "150 มล.",
                shotTime: "-",
                temp: "เย็น",
                steps: [
                    "ตวงไซรัปพีชพรีเมียม 30ml และน้ำเลมอน 5ml ลงในแก้ว",
                    "เทโซดาเย็นจัด 120ml แล้วคนเบาๆ ให้เข้ากัน",
                    "ตักน้ำแข็งเต็มแก้ว ตกแต่งด้วยใบสะระแหน่และชิ้นเนื้อพีช"
                ],
                ingredients: [
                    { id: 1, name: "ไซรัปพีชพรีเมียม 700ml", price: 320, packQty: 700, packUnit: "มล.", useQty: 30, useUnit: "มล.", isPackage: false },
                    { id: 2, name: "โซดา Singha (แพ็ค 24 ขวด)", price: 240, packQty: 7800, packUnit: "มล.", useQty: 120, useUnit: "มล.", isPackage: false },
                    { id: 3, name: "น้ำแข็งยูนิค 15kg", price: 60, packQty: 15000, packUnit: "กรัม", useQty: 200, useUnit: "กรัม", isPackage: false },
                    { id: 4, name: "แก้วพลาสติก 16oz + ฝาฮาฟ (100 ชิ้น)", price: 220, packQty: 100, packUnit: "ชิ้น", useQty: 1, useUnit: "ชิ้น", isPackage: true },
                    { id: 5, name: "หลอด + ปลอกแก้ว + สติ๊กเกอร์ (100 ชุด)", price: 90, packQty: 100, packUnit: "ชุด", useQty: 1, useUnit: "ชุด", isPackage: true }
                ]
            },
            {
                id: 106,
                name: "คาปูชิโน่ร้อน (Hot Cappuccino 8oz)",
                category: "กาแฟ",
                cogs: 17.30,
                sellingPrice: 50,
                grossProfit: 32.70,
                foodCostPercent: 34.6,
                deliveryPrice: 74,
                salesMix: 5,
                dose: "18.0 กรัม",
                yield: "30 มล.",
                shotTime: "25 วินาที",
                temp: "65°C",
                steps: [
                    "สกัดเอสเพรสโซ่ช็อต 30ml ลงในแก้วกาแฟร้อน 8oz",
                    "สตรีมนมสดให้ได้โฟมนมนุ่มหนา 1-2 ซม. อุณหภูมิ 65°C",
                    "เทโฟมนมลงบนเอสเพรสโซ่ โรยผงซินนามอนหรือโกโก้แต่งหน้า"
                ],
                ingredients: [
                    { id: 1, name: "เมล็ดกาแฟคั่ว (Specialty Blend 500g)", price: 450, packQty: 500, packUnit: "กรัม", useQty: 18, useUnit: "กรัม", isPackage: false },
                    { id: 2, name: "นมสดพาสเจอร์ไรส์ 2,000ml", price: 95, packQty: 2000, packUnit: "มล.", useQty: 120, useUnit: "มล.", isPackage: false },
                    { id: 3, name: "แก้วกระดาษร้อน 8oz + ฝา", price: 180, packQty: 100, packUnit: "ชิ้น", useQty: 1, useUnit: "ชิ้น", isPackage: true }
                ]
            }
        ];

        state.masterIngredients = sampleMaster;
        state.ingredients = sampleCurrentIngredients;
        state.overheads = sampleOverheads;
        state.investments = sampleInvestments;
        state.savedRecipes = sampleSavedRecipes;
        state.recipeName = "กาแฟลาเต้เย็น (Iced Latte 16oz)";
        state.customPrice = 65;

        safeStorageSet('brewcost_master_stock', JSON.stringify(sampleMaster));
        safeStorageSet('brewcost_current_ingredients', JSON.stringify(sampleCurrentIngredients));
        safeStorageSet('brewcost_overheads', JSON.stringify(sampleOverheads));
        safeStorageSet('brewcost_investments', JSON.stringify(sampleInvestments));
        safeStorageSet('brewcost_saved_recipes', JSON.stringify(sampleSavedRecipes));
        safeStorageSet('brewcost_current_recipe_name', state.recipeName);
        safeStorageSet('brewcost_current_custom_price', state.customPrice.toString());
        safeStorageSet('brewcost_initialized', 'true');

        const rInput = document.getElementById('recipeName');
        if (rInput) rInput.value = state.recipeName;
        const cInput = document.getElementById('customSellingPrice');
        if (cInput) cInput.value = state.customPrice;

        renderAll();
        if (showAlert) {
            alert('☕ โหลดข้อมูลตัวอย่างร้านกาแฟสมบูรณ์แล้ว! (มีเมนูกาแฟ 6 รายการ, คลังวัตถุดิบ 11 รายการ, ค่าใช้จ่ายคงที่ และเงินลงทุนเปิดร้าน)');
        }
    }

    // Check if app has ever been initialized for first-time user
    const isFirstTimeUser = safeStorageGet('brewcost_initialized') === null;

    if (isFirstTimeUser) {
        loadRichSampleData(false);
    }

    // --- State Variables ---
    let state = {
        recipeName: safeStorageGet('brewcost_current_recipe_name', "สูตรเครื่องดื่มใหม่"),
        masterIngredients: safeJSONParse('brewcost_master_stock', []),
        ingredients: safeJSONParse('brewcost_current_ingredients', []),
        selectedStyle: 'iced', // 'iced', 'hot', 'frappe'
        selectedSize: '16',   // '12', '16', '22'
        wastagePercent: 5,
        targetFoodCost: 30,
        customPrice: parseFloat(safeStorageGet('brewcost_current_custom_price', '0')) || 0,
        deliveryGpPercent: 30,
        vatIncluded: 'yes',
        overheads: safeJSONParse('brewcost_overheads', []),
        investments: safeJSONParse('brewcost_investments', []),
        equipmentCost: 220000,
        equipmentYears: 3,
        targetProfit: 30000,
        operatingDays: parseInt(safeStorageGet('brewcost_operating_days', '30')) || 30,
        savedRecipes: safeJSONParse('brewcost_saved_recipes', []),
        manualOverrideAvg: false,
        inflationPercent: 0,
        priceAdjust: 0
    };

    // If user has no saved recipes, load rich sample data automatically
    if (!Array.isArray(state.savedRecipes) || state.savedRecipes.length === 0) {
        loadRichSampleData(false);
    }

    // Update UI inputs with loaded state
    const rInputInit = document.getElementById('recipeName');
    if (rInputInit) rInputInit.value = state.recipeName;
    const cInputInit = document.getElementById('customSellingPrice');
    if (cInputInit) cInputInit.value = state.customPrice;
    const opDaysInit = document.getElementById('operatingDaysPerMonth');
    if (opDaysInit) opDaysInit.value = state.operatingDays;

    document.getElementById('operatingDaysPerMonth')?.addEventListener('input', (e) => {
        const val = parseInt(e.target.value) || 30;
        state.operatingDays = Math.max(1, Math.min(31, val));
        safeStorageSet('brewcost_operating_days', state.operatingDays);
        renderAll();
    });

    // Helper: Calculate Scale Multiplier for Size & Style
    function getScaleMultiplier() {
        let mult = 1.0;
        if (state.selectedStyle === 'hot') {
            if (state.selectedSize === '6') mult = 0.40;       // Hot 6oz (Piccolo / Cortado / Short)
            else if (state.selectedSize === '12') mult = 0.75; // Hot 12oz
            else if (state.selectedSize === '22') mult = 1.20; // Hot XL
            else mult = 0.60;                                  // Hot 8oz / 16oz Standard
        } else if (state.selectedStyle === 'frappe') {
            if (state.selectedSize === '6') mult = 0.50;       // Frappe 6oz
            else if (state.selectedSize === '12') mult = 0.85; // Frappe 12oz
            else if (state.selectedSize === '22') mult = 1.55; // Frappe 22oz
            else mult = 1.25;                                  // Frappe 16oz Standard
        } else {
            // Iced
            if (state.selectedSize === '6') mult = 0.45;       // Iced 6oz
            else if (state.selectedSize === '12') mult = 0.78; // Iced 12oz
            else if (state.selectedSize === '22') mult = 1.38; // Iced 22oz
            else mult = 1.0;                                   // Iced 16oz Standard
        }
        return mult;
    }

    // Helper: Get Margin Alert Badge HTML
    function getMarginBadgeHtml(fcPercent) {
        if (!fcPercent || fcPercent <= 0) {
            return `<span class="margin-badge margin-badge-mid"><i class="fa-solid fa-circle-info"></i> ไม่ระบุ</span>`;
        }
        if (fcPercent <= 30) {
            return `<span class="margin-badge margin-badge-high"><i class="fa-solid fa-circle-check"></i> กำไรสูงพิเศษ</span>`;
        } else if (fcPercent <= 40) {
            return `<span class="margin-badge margin-badge-mid"><i class="fa-solid fa-circle-info"></i> กำไรมาตรฐาน</span>`;
        } else {
            return `<span class="margin-badge margin-badge-low"><i class="fa-solid fa-triangle-exclamation"></i> ต้นทุนสูง</span>`;
        }
    }

    // Built-in Templates
    const BARISTA_CSV_TEMPLATE = `ชื่อเมนูกาแฟ,หมวดหมู่,ราคาขายหน้าร้าน (บาท),ผงกาแฟ,ปริมาณสกัด,เวลาสกัด,อุณหภูมิน้ำ,ขั้นตอนการชง,วัตถุดิบและปริมาณ
กาแฟลาเต้เย็น (Iced Latte 16oz),กาแฟเอสเพรสโซ่,65,18.5 กรัม,36 มล.,26 วินาที,93°C,ชั่งเมล็ดกาแฟ 18.5g บดปรับเบอร์สกัดมาตรฐาน | กดเกลี่ยและแทมป์กาแฟ สกัดเอสเพรสโซ่ 36ml | ตวงนมสด 120ml และนมข้นหวาน 15ml ใส่แก้วคนให้เข้ากัน | ตักน้ำแข็งเต็มแก้ว แล้วเทเอสเพรสโซ่ช็อตท็อปด้านบน,เมล็ดกาแฟคั่วเข้ม:18:กรัม | นมสดพาสเจอร์ไรส์:120:มล. | นมข้นหวาน:15:มล. | แก้วพลาสติก 16oz + ฝาฮาฟ:1:ชิ้น
อเมริกาโน่เย็น (Iced Americano 16oz),กาแฟเอสเพรสโซ่,55,18.0 กรัม,36 มล.,25 วินาที,93°C,สกัดเอสเพรสโซ่ดับเบิลช็อต 36ml | ใส่น้ำเปล่ากรองสะอาด 120ml ลงในแก้ว 16oz | ตักน้ำแข็งเต็มแก้ว แล้วราดเอสเพรสโซ่ช็อตท็อปด้านบน,เมล็ดกาแฟคั่วกลาง:18:กรัม | น้ำเปล่ากรองสะอาด:120:มล. | แก้วพลาสติก 16oz + ฝาฮาฟ:1:ชิ้น
มัทฉะลาเต้เย็น (Matcha Latte 16oz),ชา,75,5.0 กรัม,40 มล.,-,80°C,ตวงผงมัทฉะ 5g ใส่น้ำร้อน 40ml ใช้น้ำอุณหภูมิ 80°C ตีด้วยแปรงไม้ไผ่จนละลายเป็นเนียนโฟม | ผสมนมสด 150ml กับน้ำเชื่อม 15ml ลงในแก้ว | ตักน้ำแข็งเต็มแก้ว แล้วเทซอสมัทฉะท็อปเลเยอร์ด้านบน,ผงมัทฉะเกรดพิธีการ:5:กรัม | นมสดพาสเจอร์ไรส์:150:มล. | น้ำเชื่อมแท้:15:มล. | แก้วพลาสติก 16oz + ฝาฮาฟ:1:ชิ้น
โกโก้เย็นเข้มข้น (Iced Cocoa 16oz),นม / โกโก้,60,20.0 กรัม,50 มล.,-,85°C,ชงผงโกโก้ 20g กับน้ำร้อน 50ml คนจนละลายเนียน | เติมนมสด 100ml นมข้นหวาน 20ml และนมข้นจืด 15ml | ตักน้ำแข็งเต็มแก้ว แล้วราดซอสโกโก้เข้มข้นท็อปด้านบน,ผงโกโก้ 100%:20:กรัม | นมสดพาสเจอร์ไรส์:100:มล. | นมข้นหวาน:20:มล. | แก้วพลาสติก 16oz + ฝาฮาฟ:1:ชิ้น`;

    const MASTER_CSV_TEMPLATE = `ชื่อวัตถุดิบ,ราคาซื้อยกแพ็ค (บาท),ปริมาณสุทธิ/แพ็ค,หน่วย
เมล็ดกาแฟคั่วเข้ม (Dark Roast Coffee Beans),420,500,กรัม
นมสดพาสเจอร์ไรส์ 2000ml,95,2000,มล.
นมข้นหวาน 380g,55,380,มล.
ผงมัทฉะพรีเมียม 100g,550,100,กรัม
ผงโกโก้ 100% 500g,180,500,กรัม
ไซรัปคาราเมล 750ml,280,750,มล.
น้ำเชื่อมแท้ 750ml,120,750,มล.
น้ำแข็งยูนิค 15kg,60,15000,กรัม
แก้วพลาสติก 16oz + ฝาฮาฟ,220,100,ชิ้น
หลอดพลาสติกหุ้มกระดาษ,90,100,ชุด`;

    const CSV_TEMPLATE_CONTENT = `ชื่อเมนู,ราคาขายหน้าร้าน (บาท),รายการวัตถุดิบ/บรรจุภัณฑ์,ราคาซื้อ (บาท),ปริมาณสุทธิ/แพ็ค,หน่วยแพ็ค,ปริมาณที่ใช้,หน่วยที่ใช้
เอสเพรสโซ่เย็น (Iced Thai Espresso 16oz),65,เมล็ดกาแฟคั่วเข้ม (Dark Roast Beans),400,500,กรัม,20,กรัม
เอสเพรสโซ่เย็น (Iced Thai Espresso 16oz),65,นมผสม (Sweetened Condensed Milk Mix),65,500,มล.,30,มล.
เอสเพรสโซ่เย็น (Iced Thai Espresso 16oz),65,นมสดพาสเจอร์ไรส์,95,2000,มล.,60,มล.
เอสเพรสโซ่เย็น (Iced Thai Espresso 16oz),65,น้ำแข็ง,60,15000,กรัม,200,กรัม
เอสเพรสโซ่เย็น (Iced Thai Espresso 16oz),65,แก้วพลาสติก 16oz + ฝา,220,100,ชิ้น,1,ชิ้น
เอสเพรสโซ่เย็น (Iced Thai Espresso 16oz),65,หลอด + ปลอกแก้ว,90,100,ชุด,1,ชุด`;

    const JSON_TEMPLATE_CONTENT = JSON.stringify(state.savedRecipes, null, 2);

    // Charts references
    let recipeChartInstance = null;
    let overheadChartInstance = null;
    let breakEvenChartInstance = null;

    // Theme Toggle Listener
    const btnThemeToggle = document.getElementById('btnThemeToggle');
    const themeToggleText = document.getElementById('themeToggleText');

    btnThemeToggle?.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        themeToggleText.textContent = isDark ? 'โหมดสว่าง' : 'โหมดมืด';
        btnThemeToggle.querySelector('i').className = isDark ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
        renderAll();
    });

    // Style & Size Selector Listeners
    document.querySelectorAll('#styleSelectorGroup .btn-segment').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('#styleSelectorGroup .btn-segment').forEach(b => b.classList.remove('active'));
            e.currentTarget.classList.add('active');
            state.selectedStyle = e.currentTarget.dataset.style;
            renderAll();
        });
    });

    document.querySelectorAll('#sizeSelectorGroup .btn-segment').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('#sizeSelectorGroup .btn-segment').forEach(b => b.classList.remove('active'));
            e.currentTarget.classList.add('active');
            state.selectedSize = e.currentTarget.dataset.size;
            renderAll();
        });
    });

    // Button Load Sample Cafe Data Listener
    document.getElementById('btnLoadSampleCafeData')?.addEventListener('click', () => {
        loadRichSampleData(true);
    });

    // Helper: Parse Ingredients Text into Object Array
    function parseIngredientsFromText(text) {
        if (!text || !text.trim()) return [];
        const lines = text.split(/\r?\n|\|/).filter(l => l.trim() !== '');
        return lines.map((line, idx) => {
            const parts = line.split(/[:：]/).map(p => p.trim());
            const name = parts[0] || `วัตถุดิบ ${idx + 1}`;
            let useQty = 1;
            let useUnit = 'กรัม';

            if (parts[1]) {
                const match = parts[1].match(/^([\d.]+)\s*(.*)$/);
                if (match) {
                    useQty = parseFloat(match[1]) || 1;
                    useUnit = match[2].trim() || 'กรัม';
                } else {
                    useQty = parseFloat(parts[1]) || 1;
                }
            }

            const masterMatch = state.masterIngredients.find(m => 
                m.name.toLowerCase().includes(name.toLowerCase()) || name.toLowerCase().includes(m.name.toLowerCase())
            );

            const isPkg = (useUnit === 'ชิ้น' || useUnit === 'ชุด' || useUnit === 'กล่อง' || useUnit === 'ฝา');

            return {
                id: Date.now() + idx,
                masterId: masterMatch ? masterMatch.id : null,
                name: name,
                price: masterMatch ? masterMatch.price : (isPkg ? 220 : 100),
                packQty: masterMatch ? masterMatch.packQty : (isPkg ? 100 : 1000),
                packUnit: masterMatch ? masterMatch.packUnit : useUnit,
                useQty: useQty,
                useUnit: useUnit,
                isPackage: isPkg
            };
        });
    }

    // Add Coffee Recipe Modal Listener
    const addRecipeModal = document.getElementById('addRecipeModal');
    document.getElementById('btnAddRecipeModal')?.addEventListener('click', () => {
        addRecipeModal.classList.add('active');
    });

    document.getElementById('btnCloseAddRecipeModal')?.addEventListener('click', () => {
        addRecipeModal.classList.remove('active');
    });

    document.getElementById('formAddNewRecipe')?.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const title = document.getElementById('newRecipeTitle').value.trim();
        const category = document.getElementById('newRecipeCategory').value;
        const price = parseFloat(document.getElementById('newRecipePrice').value) || 60;
        const dose = document.getElementById('newRecipeDose').value.trim() || '18.5 กรัม';
        const yieldVal = document.getElementById('newRecipeYield').value.trim() || '36 มล.';
        const timeVal = document.getElementById('newRecipeTime').value.trim() || '26 วินาที';
        const stepsText = document.getElementById('newRecipeSteps').value.trim();
        const ingText = document.getElementById('newRecipeIngredientsText')?.value.trim();

        const steps = stepsText 
            ? stepsText.split('\n').filter(s => s.trim() !== '')
            : ['ผสมส่วนผสมทั้งหมดลงในแก้ว', 'ใส่น้ำแข็งเสิร์ฟทันที'];

        const ingredients = ingText 
            ? parseIngredientsFromText(ingText)
            : (state.ingredients.length > 0 ? JSON.parse(JSON.stringify(state.ingredients)) : []);

        let calculatedCogs = 0;
        ingredients.forEach(i => {
            const p = i.price || 0;
            const q = i.packQty || 1;
            calculatedCogs += (p / q) * (i.useQty || 0);
        });

        const finalCogs = calculatedCogs > 0 ? calculatedCogs : 25;

        const newRecipeObj = {
            id: Date.now(),
            name: title,
            category: category,
            sellingPrice: price,
            cogs: finalCogs,
            grossProfit: price - finalCogs,
            foodCostPercent: price > 0 ? (finalCogs / price) * 100 : 0,
            deliveryPrice: price / (1 - 0.321),
            salesMix: 20,
            dose: dose,
            yield: yieldVal,
            shotTime: timeVal,
            temp: "93°C",
            steps: steps,
            ingredients: ingredients
        };

        state.savedRecipes.push(newRecipeObj);
        safeStorageSet('brewcost_saved_recipes', JSON.stringify(state.savedRecipes));

        addRecipeModal.classList.remove('active');
        document.getElementById('formAddNewRecipe').reset();

        alert(`เพิ่มสูตร "${title}" เข้าคลังเก็บสูตรเรียบร้อยแล้ว!`);
        switchTab('tab-recipe-cards');
        renderAll();
    });

    // Search Filter in Barista Recipe Book
    document.getElementById('searchRecipeCardInput')?.addEventListener('input', (e) => {
        renderRecipeCardsGrid(e.target.value.trim().toLowerCase());
    });

    // Barista Recipe Book CSV Upload & Download Logic
    document.getElementById('btnExportBaristaRecipes')?.addEventListener('click', () => {
        if (!Array.isArray(state.savedRecipes) || state.savedRecipes.length === 0) {
            alert('ไม่มีสูตรกาแฟในคลังสำหรับส่งออก');
            return;
        }

        let csvLines = ['ชื่อเมนูกาแฟ,หมวดหมู่,ราคาขายหน้าร้าน (บาท),ผงกาแฟ,ปริมาณสกัด,เวลาสกัด,อุณหภูมิน้ำ,ขั้นตอนการชง,วัตถุดิบและปริมาณ'];

        state.savedRecipes.forEach(r => {
            const name = `"${(r.name || '').replace(/"/g, '""')}"`;
            const cat = `"${(r.category || 'กาแฟ').replace(/"/g, '""')}"`;
            const price = r.sellingPrice || 60;
            const dose = `"${(r.dose || '-').replace(/"/g, '""')}"`;
            const yieldVal = `"${(r.yield || '-').replace(/"/g, '""')}"`;
            const timeVal = `"${(r.shotTime || '-').replace(/"/g, '""')}"`;
            const tempVal = `"${(r.temp || '93°C').replace(/"/g, '""')}"`;

            const stepsStr = `"${(r.steps || []).join(' | ').replace(/"/g, '""')}"`;
            const ingStr = `"${(r.ingredients || []).map(i => `${i.name}:${i.useQty}:${i.useUnit}`).join(' | ').replace(/"/g, '""')}"`;

            csvLines.push(`${name},${cat},${price},${dose},${yieldVal},${timeVal},${tempVal},${stepsStr},${ingStr}`);
        });

        const csvContent = '\uFEFF' + csvLines.join('\n');
        downloadFile(csvContent, `barista_recipes_export_${Date.now()}.csv`, 'text/csv;charset=utf-8;');
    });

    document.getElementById('btnDownloadBaristaCSVTemplate')?.addEventListener('click', () => {
        const csvContentWithBOM = '\uFEFF' + BARISTA_CSV_TEMPLATE;
        downloadFile(csvContentWithBOM, 'barista_recipes_template.csv', 'text/csv;charset=utf-8;');
    });

    const btnUploadBaristaRecipes = document.getElementById('btnUploadBaristaRecipes');
    const fileInputBaristaRecipes = document.getElementById('fileInputBaristaRecipes');

    btnUploadBaristaRecipes?.addEventListener('click', () => {
        fileInputBaristaRecipes.click();
    });

    fileInputBaristaRecipes?.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const content = event.target.result;
                if (file.name.toLowerCase().endsWith('.csv')) {
                    parseAndImportBaristaCSV(content);
                } else if (file.name.toLowerCase().endsWith('.json')) {
                    parseAndImportJSON(content);
                } else {
                    alert('รองรับเฉพาะไฟล์ .csv หรือ .json เท่านั้น');
                }
            } catch (err) {
                alert('เกิดข้อผิดพลาดในการอ่านไฟล์: ' + err.message);
            }
            fileInputBaristaRecipes.value = '';
        };
        reader.readAsText(file, 'UTF-8');
    });

    function parseAndImportBaristaCSV(csvText) {
        const lines = csvText.split(/\r?\n/).filter(line => line.trim() !== '');
        if (lines.length <= 1) {
            alert('ไฟล์ CSV สูตรชงไม่มีข้อมูล');
            return;
        }

        let addedCount = 0;
        for (let i = 1; i < lines.length; i++) {
            const cols = lines[i].split(',').map(c => c.trim().replace(/^"|"$/g, ''));
            if (cols.length < 3) continue;

            const name = cols[0];
            const category = cols[1] || "กาแฟเอสเพรสโซ่";
            const price = parseFloat(cols[2]) || 60;
            const dose = cols[3] || "18.5 กรัม";
            const yieldVal = cols[4] || "36 มล.";
            const timeVal = cols[5] || "26 วินาที";
            const tempVal = cols[6] || "93°C";
            const rawSteps = cols[7] ? cols[7].split('|').map(s => s.trim()) : ["ผสมส่วนผสมลงในแก้ว", "ใส่น้ำแข็งเสิร์ฟ"];
            
            const rawIngredients = cols[8] ? cols[8].split('|').map(ing => {
                const parts = ing.split(':').map(p => p.trim());
                const ingName = parts[0] || "วัตถุดิบ";
                const masterMatch = state.masterIngredients.find(m => m.name.includes(ingName) || ingName.includes(m.name));
                return {
                    name: ingName,
                    price: masterMatch ? masterMatch.price : 100,
                    packQty: masterMatch ? masterMatch.packQty : 1000,
                    packUnit: masterMatch ? masterMatch.packUnit : (parts[2] || "กรัม"),
                    useQty: parseFloat(parts[1]) || 1,
                    useUnit: parts[2] || "กรัม"
                };
            }) : [
                { name: "ผงกาแฟ/ชา", price: 450, packQty: 500, packUnit: "กรัม", useQty: 18, useUnit: "กรัม" },
                { name: "แก้วพลาสติก", price: 220, packQty: 100, packUnit: "ชิ้น", useQty: 1, useUnit: "ชิ้น", isPackage: true }
            ];

            let cogs = 25;
            const recipeObj = {
                id: Date.now() + i,
                name: name,
                category: category,
                sellingPrice: price,
                cogs: cogs,
                grossProfit: price - cogs,
                foodCostPercent: price > 0 ? (cogs / price) * 100 : 0,
                deliveryPrice: price / (1 - 0.321),
                salesMix: 20,
                dose: dose,
                yield: yieldVal,
                shotTime: timeVal,
                temp: tempVal,
                steps: rawSteps,
                ingredients: rawIngredients
            };

            state.savedRecipes.push(recipeObj);
            addedCount++;
        }

        if (addedCount > 0) {
            localStorage.setItem('brewcost_saved_recipes', JSON.stringify(state.savedRecipes));
            alert(`อัปโหลดสูตรชงกาแฟสำเร็จ! นำเข้าสูตรเรียบร้อยแล้วจำนวน ${addedCount} รายการ`);
            switchTab('tab-recipe-cards');
            renderAll();
        } else {
            alert('ไม่สามารถอ่านข้อมูลสูตรชงจากไฟล์ CSV ได้');
        }
    }

    // Dropdown Select Recipe Listener
    const selectRecipeDropdown = document.getElementById('selectRecipeDropdown');
    selectRecipeDropdown?.addEventListener('change', (e) => {
        const val = e.target.value;
        if (!val) return;

        if (val.startsWith('saved:')) {
            const idx = parseInt(val.replace('saved:', ''), 10);
            loadSavedRecipe(idx);
        }
    });

    // Master Stock Excel / CSV Download & Upload Logic
    document.getElementById('btnDownloadMasterCSVTemplate')?.addEventListener('click', () => {
        const csvContentWithBOM = '\uFEFF' + MASTER_CSV_TEMPLATE;
        downloadFile(csvContentWithBOM, 'master_ingredients_template.csv', 'text/csv;charset=utf-8;');
    });

    const btnUploadMasterStock = document.getElementById('btnUploadMasterStock');
    const fileInputMasterStock = document.getElementById('fileInputMasterStock');

    btnUploadMasterStock?.addEventListener('click', () => {
        fileInputMasterStock.click();
    });

    fileInputMasterStock?.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const content = event.target.result;
                if (file.name.toLowerCase().endsWith('.csv')) {
                    parseAndImportMasterCSV(content);
                } else if (file.name.toLowerCase().endsWith('.json')) {
                    const data = JSON.parse(content);
                    if (Array.isArray(data)) {
                        state.masterIngredients = data;
                        localStorage.setItem('brewcost_master_stock', JSON.stringify(state.masterIngredients));
                        alert(`นำเข้าคลังวัตถุดิบเรียบร้อยแล้วจำนวน ${data.length} รายการ!`);
                        renderAll();
                    }
                } else {
                    alert('รองรับเฉพาะไฟล์ .csv หรือ .json เท่านั้น');
                }
            } catch (err) {
                alert('เกิดข้อผิดพลาดในการอ่านไฟล์: ' + err.message);
            }
            fileInputMasterStock.value = '';
        };
        reader.readAsText(file, 'UTF-8');
    });

    function parseAndImportMasterCSV(csvText) {
        const lines = csvText.split(/\r?\n/).filter(line => line.trim() !== '');
        if (lines.length <= 1) {
            alert('ไฟล์ CSV คลังวัตถุดิบไม่มีข้อมูล');
            return;
        }

        let importedCount = 0;
        const newMasterList = [];

        for (let i = 1; i < lines.length; i++) {
            const cols = lines[i].split(',').map(c => c.trim().replace(/^"|"$/g, ''));
            if (cols.length < 4) continue;

            const name = cols[0];
            const price = parseFloat(cols[1]) || 0;
            const packQty = parseFloat(cols[2]) || 1;
            const packUnit = cols[3] || "กรัม";

            if (name) {
                newMasterList.push({
                    id: 'm_' + Date.now() + '_' + i,
                    name: name,
                    price: price,
                    packQty: packQty,
                    packUnit: packUnit
                });
                importedCount++;
            }
        }

        if (importedCount > 0) {
            state.masterIngredients = newMasterList;
            localStorage.setItem('brewcost_master_stock', JSON.stringify(state.masterIngredients));

            // Sync recipe ingredients
            state.masterIngredients.forEach(masterItem => {
                state.ingredients.forEach(ing => {
                    if (ing.masterId === masterItem.id || ing.name === masterItem.name) {
                        ing.price = masterItem.price;
                        ing.packQty = masterItem.packQty;
                        ing.packUnit = masterItem.packUnit;
                    }
                });
            });

            alert(`อัปโหลดไฟล์วัตถุดิบกลางสำเร็จ! นำเข้าแล้ว ${importedCount} รายการ`);
            renderAll();
        } else {
            alert('ไม่สามารถอ่านข้อมูลวัตถุดิบจากไฟล์ CSV ได้');
        }
    }

    // Reset All Data Listener
    document.getElementById('btnResetAllData')?.addEventListener('click', () => {
        if (confirm('⚠️ คุณต้องการล้างข้อมูลทั้งหมดในระบบใช่หรือไม่?\n(ข้อมูลสูตรที่บันทึกไว้ คลังเมนู คลังวัตถุดิบ ค่าใช้จ่ายคงที่ และเงินลงทุนจะถูกลบทิ้งทั้งหมด)')) {
            localStorage.clear();
            localStorage.setItem('brewcost_initialized', 'true');

            state.savedRecipes = [];
            state.masterIngredients = [];
            state.ingredients = [];
            state.overheads = [];
            state.investments = [];
            state.recipeName = "สูตรเครื่องดื่มใหม่";
            state.customPrice = 0;
            state.targetProfit = 30000;
            state.manualOverrideAvg = false;

            localStorage.setItem('brewcost_saved_recipes', JSON.stringify([]));
            localStorage.setItem('brewcost_master_stock', JSON.stringify([]));
            localStorage.setItem('brewcost_current_ingredients', JSON.stringify([]));
            localStorage.setItem('brewcost_overheads', JSON.stringify([]));
            localStorage.setItem('brewcost_investments', JSON.stringify([]));
            localStorage.setItem('brewcost_current_recipe_name', "สูตรเครื่องดื่มใหม่");
            localStorage.setItem('brewcost_current_custom_price', "0");

            const rInput = document.getElementById('recipeName');
            if (rInput) rInput.value = state.recipeName;
            const cInput = document.getElementById('customSellingPrice');
            if (cInput) cInput.value = 0;

            renderAll();
            alert('ล้างข้อมูลทั้งหมดเรียบร้อยแล้ว!');
        }
    });

    // --- Core Calculation Functions ---

    function calculateIngredientCost(item) {
        if (!item.packQty || item.packQty <= 0) return 0;
        const unitCost = (item.price || 0) / item.packQty;
        const mult = item.isPackage ? 1.0 : getScaleMultiplier();
        return unitCost * ((item.useQty || 0) * mult);
    }

    function calculateTotals() {
        let rawCost = 0;
        state.ingredients.forEach(item => {
            rawCost += calculateIngredientCost(item);
        });

        const wastageCost = rawCost * (state.wastagePercent / 100);
        const totalCogs = rawCost + wastageCost;

        const targetFc = state.targetFoodCost > 0 ? state.targetFoodCost / 100 : 0.3;
        const recPrice = totalCogs / targetFc;

        const customSelling = parseFloat(state.customPrice) || 0;
        const grossProfit = customSelling - totalCogs;
        const actualFcPercent = customSelling > 0 ? (totalCogs / customSelling) * 100 : 0;
        const grossMarginPercent = customSelling > 0 ? (grossProfit / customSelling) * 100 : 0;

        const gpFrac = (state.deliveryGpPercent || 0) / 100;
        const vatMult = state.vatIncluded === 'yes' ? 1.07 : 1.0;
        const totalPlatformCut = gpFrac * vatMult;
        const deliveryPrice = totalPlatformCut < 1 ? customSelling / (1 - totalPlatformCut) : 0;

        // Delivery Profit Matrix Breakdown
        const deliveryNetCut = deliveryPrice * totalPlatformCut;
        const deliveryNetProfit = deliveryPrice - deliveryNetCut - totalCogs;
        const deliveryNetMargin = deliveryPrice > 0 ? (deliveryNetProfit / deliveryPrice) * 100 : 0;

        let fixedOverheadSum = 0;
        if (Array.isArray(state.overheads)) {
            state.overheads.forEach(ov => {
                fixedOverheadSum += (parseFloat(ov.amount) || 0);
            });
        }

        let totalCapEx = 0;
        if (Array.isArray(state.investments)) {
            state.investments.forEach(inv => {
                totalCapEx += (parseFloat(inv.amount) || 0);
            });
        }

        const eqYears = parseFloat(document.getElementById('eqYears')?.value) || state.equipmentYears || 3;

        const monthlyDepreciation = (totalCapEx > 0 && eqYears > 0)
            ? totalCapEx / (eqYears * 12)
            : 0;

        let totalFixedOverhead = fixedOverheadSum + monthlyDepreciation;
        const opDays = state.operatingDays || 30;
        const dailyFixedOverhead = totalFixedOverhead > 0 ? (totalFixedOverhead / opDays) : 0;

        // Auto-calculate average selling price and average COGS from saved recipes catalog
        let autoAvgPrice = 65;
        let autoAvgCogs = 19.50;

        if (Array.isArray(state.savedRecipes) && state.savedRecipes.length > 0) {
            const validRecipes = state.savedRecipes.filter(r => (parseFloat(r.sellingPrice) || 0) > 0);
            if (validRecipes.length > 0) {
                const sumPrice = validRecipes.reduce((acc, r) => acc + (parseFloat(r.sellingPrice) || 0), 0);
                const sumCogs = validRecipes.reduce((acc, r) => acc + (parseFloat(r.cogs) || 0), 0);
                autoAvgPrice = sumPrice / validRecipes.length;
                autoAvgCogs = sumCogs / validRecipes.length;
            }
        } else {
            autoAvgPrice = customSelling > 0 ? customSelling : 65;
            autoAvgCogs = totalCogs > 0 ? totalCogs : 19.50;
        }

        const calcAvgPriceInput = document.getElementById('calcAvgPrice');
        const calcAvgCogsInput = document.getElementById('calcAvgCogs');

        if (!state.manualOverrideAvg) {
            if (calcAvgPriceInput) calcAvgPriceInput.value = autoAvgPrice.toFixed(2);
            if (calcAvgCogsInput) calcAvgCogsInput.value = autoAvgCogs.toFixed(2);
        }

        let avgPrice = parseFloat(calcAvgPriceInput?.value);
        if (!avgPrice || avgPrice <= 0 || isNaN(avgPrice)) {
            avgPrice = autoAvgPrice;
        }

        let avgCogs = parseFloat(calcAvgCogsInput?.value);
        if (isNaN(avgCogs) || avgCogs < 0) {
            avgCogs = autoAvgCogs;
        }

        const contributionMarginPerCup = avgPrice - avgCogs;

        let beCupsMonth = 0;
        let beCupsDay = 0;
        let beRevenueMonth = 0;

        let targetCupsMonth = 0;
        let targetCupsDay = 0;
        let targetRevenueMonth = 0;

        if (contributionMarginPerCup > 0 && totalFixedOverhead > 0) {
            beCupsMonth = Math.ceil(totalFixedOverhead / contributionMarginPerCup);
            beCupsDay = Math.ceil(beCupsMonth / opDays);
            beRevenueMonth = beCupsMonth * avgPrice;

            const userTargetProfit = parseFloat(document.getElementById('targetMonthlyProfit')?.value) || state.targetProfit || 30000;
            const targetTotal = totalFixedOverhead + userTargetProfit;
            targetCupsMonth = Math.ceil(targetTotal / contributionMarginPerCup);
            targetCupsDay = Math.ceil(targetCupsMonth / opDays);
            targetRevenueMonth = targetCupsMonth * avgPrice;
        }

        const shortfallCupsMonth = Math.max(0, targetCupsMonth - beCupsMonth);
        const shortfallCupsDay = Math.ceil(shortfallCupsMonth / opDays);
        const shortfallRevenueMonth = Math.max(0, targetRevenueMonth - beRevenueMonth);

        return {
            rawCost,
            wastageCost,
            totalCogs,
            recPrice,
            customSelling,
            grossProfit,
            actualFcPercent,
            grossMarginPercent,
            deliveryPrice,
            deliveryNetCut,
            deliveryNetProfit,
            deliveryNetMargin,
            totalFixedOverhead,
            dailyFixedOverhead,
            totalCapEx,
            monthlyDepreciation,
            avgPrice,
            avgCogs,
            contributionMarginPerCup,
            beCupsMonth,
            beCupsDay,
            beRevenueMonth,
            targetCupsMonth,
            targetCupsDay,
            targetRevenueMonth,
            shortfallCupsMonth,
            shortfallCupsDay,
            shortfallRevenueMonth
        };
    }

    // --- DOM Update / Render Functions ---

    function renderAll() {
        const res = calculateTotals();
        const mult = getScaleMultiplier();

        // Update Scaler Badge
        const scalerBadge = document.getElementById('scalerRatioBadge');
        if (scalerBadge) {
            const styleName = state.selectedStyle === 'hot' ? 'ร้อน' : (state.selectedStyle === 'frappe' ? 'ปั่น' : 'เย็น');
            scalerBadge.textContent = `${state.selectedSize}oz ${styleName} (${mult.toFixed(2)}x)`;
        }

        try { document.getElementById('kpiCogs').textContent = `฿${res.totalCogs.toFixed(2)}`; } catch(e){}
        try { document.getElementById('kpiWastageText').textContent = `รวมเผื่อสูญเสีย ${state.wastagePercent}%`; } catch(e){}
        try { document.getElementById('kpiRecPrice').textContent = `฿${res.recPrice.toFixed(2)}`; } catch(e){}
        try { document.getElementById('kpiMarginText').textContent = `เป้าหมาย Food Cost ${state.targetFoodCost}%`; } catch(e){}
        try { document.getElementById('kpiDeliveryPrice').textContent = `฿${res.deliveryPrice.toFixed(0)}`; } catch(e){}
        try { document.getElementById('kpiBreakEvenCups').textContent = `${res.beCupsDay} แก้ว/วัน`; } catch(e){}
        try { document.getElementById('kpiBreakEvenMonth').textContent = `ประมาณ ${res.beCupsMonth.toLocaleString()} แก้ว/เดือน`; } catch(e){}

        try { renderIngredientsTable(); } catch(e){ console.error("renderIngredientsTable:", e); }
        try { renderMasterIngredientsTable(); } catch(e){ console.error("renderMasterIngredientsTable:", e); }
        try { renderSavedDropdownOptions(); } catch(e){ console.error("renderSavedDropdownOptions:", e); }
        try { renderRecipeCardsGrid(); } catch(e){ console.error("renderRecipeCardsGrid:", e); }

        try { document.getElementById('rawMaterialCost').textContent = `฿${res.rawCost.toFixed(2)}`; } catch(e){}
        try { document.getElementById('displayWastagePercent').textContent = state.wastagePercent; } catch(e){}
        try { document.getElementById('wastageCost').textContent = `฿${res.wastageCost.toFixed(2)}`; } catch(e){}
        try { document.getElementById('totalCogsDisplay').textContent = `฿${res.totalCogs.toFixed(2)}`; } catch(e){}

        try { document.getElementById('grossProfitVal').textContent = `฿${res.grossProfit.toFixed(2)}`; } catch(e){}
        try { document.getElementById('grossMarginPercent').textContent = `กำไร ${res.grossMarginPercent.toFixed(1)}%`; } catch(e){}
        
        try {
            const fcEl = document.getElementById('actualFoodCostPercent');
            if (fcEl) {
                fcEl.textContent = `${res.actualFoodCostPercent.toFixed(1)}%`;
            }
            const statusEl = document.getElementById('foodCostStatus');
            if (statusEl) {
                statusEl.innerHTML = getMarginBadgeHtml(res.actualFoodCostPercent);
            }
        } catch(e){}

        // Update Sales Channel Matrix Card
        try {
            document.getElementById('matrixDineInPrice').textContent = `฿${res.customSelling.toFixed(2)}`;
            document.getElementById('matrixDineInProfit').textContent = `฿${res.grossProfit.toFixed(2)}`;
            document.getElementById('matrixDineInMargin').textContent = `(กำไร ${res.grossMarginPercent.toFixed(1)}%)`;

            document.getElementById('matrixDeliveryGpTag').textContent = `GP ${state.deliveryGpPercent}%${state.vatIncluded === 'yes' ? '+VAT' : ''}`;
            document.getElementById('matrixDeliveryPrice').textContent = `฿${Math.ceil(res.deliveryPrice).toFixed(2)}`;
            document.getElementById('matrixDeliveryProfit').textContent = `฿${res.deliveryNetProfit.toFixed(2)}`;
            document.getElementById('matrixDeliveryMargin').textContent = `(กำไร ${res.deliveryNetMargin.toFixed(1)}%)`;
        } catch(e){}

        try { document.getElementById('deliverySuggestedPrice').textContent = `฿${Math.ceil(res.deliveryPrice)}`; } catch(e){}
        try { document.getElementById('targetProfitEqual').textContent = res.grossProfit.toFixed(2); } catch(e){}

        try { renderOverheadList(); } catch(e){ console.error("renderOverheadList:", e); }
        try { renderInvestmentList(); } catch(e){ console.error("renderInvestmentList:", e); }
        
        try { document.getElementById('totalCapExDisplay').textContent = `฿${res.totalCapEx.toLocaleString('th-TH', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`; } catch(e){}
        try { document.getElementById('depreciationMonthly').textContent = `฿${res.monthlyDepreciation.toLocaleString('th-TH', {minimumFractionDigits: 2, maximumFractionDigits: 2})} / เดือน`; } catch(e){}
        try { document.getElementById('totalFixedOverhead').textContent = `฿${res.totalFixedOverhead.toLocaleString('th-TH', {minimumFractionDigits: 2, maximumFractionDigits: 2})} / เดือน`; } catch(e){}
        try { document.getElementById('dailyOverheadAvgAmount').textContent = `฿${res.dailyFixedOverhead.toLocaleString('th-TH', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`; } catch(e){}

        try { document.getElementById('beCupsMonth').textContent = res.beCupsMonth.toLocaleString(); } catch(e){}
        try { document.getElementById('beCupsDay').textContent = res.beCupsDay.toLocaleString(); } catch(e){}
        try { document.getElementById('beRevenueMonth').textContent = res.beRevenueMonth.toLocaleString('th-TH', {minimumFractionDigits: 2}); } catch(e){}

        try { document.getElementById('targetCupsMonth').textContent = res.targetCupsMonth.toLocaleString(); } catch(e){}
        try { document.getElementById('targetCupsDay').textContent = res.targetCupsDay.toLocaleString(); } catch(e){}
        try { document.getElementById('targetRevenueMonth').textContent = res.targetRevenueMonth.toLocaleString('th-TH', {minimumFractionDigits: 2}); } catch(e){}

        try { document.getElementById('shortfallCupsMonth').textContent = res.shortfallCupsMonth.toLocaleString(); } catch(e){}
        try { document.getElementById('shortfallCupsDay').textContent = res.shortfallCupsDay.toLocaleString(); } catch(e){}
        try { document.getElementById('shortfallRevenueMonth').textContent = res.shortfallRevenueMonth.toLocaleString('th-TH', {minimumFractionDigits: 2}); } catch(e){}

        try { renderRecipeChart(); } catch(e){ console.error("renderRecipeChart:", e); }
        try { renderOverheadChart(); } catch(e){ console.error("renderOverheadChart:", e); }
        try { renderBreakEvenChart(res); } catch(e){ console.error("renderBreakEvenChart:", e); }
        try { renderInflationSimulator(); } catch(e){ console.error("renderInflationSimulator:", e); }
        try { renderReorderPlanner(); } catch(e){ console.error("renderReorderPlanner:", e); }

        try { renderSavedRecipesTable(); } catch(e){ console.error("renderSavedRecipesTable:", e); }
    }

    // Render Barista Recipe Cards Grid with Margin Badge & Bar Card Print Button
    function renderRecipeCardsGrid(filterKeyword = "") {
        const grid = document.getElementById('recipeCardsGrid');
        if (!grid) return;
        grid.innerHTML = '';

        if (!Array.isArray(state.savedRecipes) || state.savedRecipes.length === 0) {
            grid.innerHTML = '<div class="text-center text-muted py-5" style="grid-column: 1/-1;">ยังไม่มีสูตรกาแฟในคลัง กดปุ่ม "+ เพิ่มสูตรเมนูกาแฟ" หรืออัปโหลดไฟล์สูตรเพื่อเพิ่มข้อมูล</div>';
            return;
        }

        const filtered = state.savedRecipes.filter(r => 
            !filterKeyword || (r.name && r.name.toLowerCase().includes(filterKeyword))
        );

        if (filtered.length === 0) {
            grid.innerHTML = `<div class="text-center text-muted py-5" style="grid-column: 1/-1;">ไม่พบสูตรกาแฟที่ตรงกับคำค้นหา "${filterKeyword}"</div>`;
            return;
        }

        filtered.forEach((recipe, index) => {
            const card = document.createElement('div');
            card.className = 'recipe-card';

            const fcBadgeHtml = getMarginBadgeHtml(recipe.foodCostPercent || 35);
            const ingListHtml = (recipe.ingredients || []).map(i => `<li>${i.name}: <strong>${i.useQty} ${i.useUnit}</strong></li>`).join('');
            const stepsHtml = (recipe.steps || [
                "ผสมส่วนผสมตามปริมาณที่กำหนดลงในแก้ว",
                "ใส่น้ำแข็งเต็มแก้ว แล้วเสิร์ฟทันที"
            ]).map(s => `<li>${s}</li>`).join('');

            card.innerHTML = `
                <div>
                    <div class="recipe-card-header">
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                            <span class="recipe-badge">☕ ${recipe.category || 'กาแฟ'}</span>
                            <div>${fcBadgeHtml}</div>
                        </div>
                        <div class="recipe-card-title mb-2" style="font-size:15px; font-weight:800; color:var(--text-main); line-height:1.35;">${recipe.name}</div>
                        <div style="display:flex; justify-content:space-between; align-items:center; background:var(--bg-input); padding:6px 12px; border-radius:6px; border:1px solid var(--border-color); font-size:12px;">
                            <div>
                                <span style="color:var(--text-muted); font-size:11px;">ราคาขาย:</span>
                                <strong style="font-weight:700; color:var(--text-main); font-size:13px; margin-left:4px;">฿${(recipe.sellingPrice || 0).toFixed(0)}</strong>
                            </div>
                            <div style="width:1px; height:14px; background:var(--border-color);"></div>
                            <div>
                                <span style="color:var(--text-muted); font-size:11px;">ต้นทุน COGS:</span>
                                <strong class="color-amber" style="font-weight:700; font-size:13px; margin-left:4px;">฿${(recipe.cogs || 0).toFixed(2)}</strong>
                            </div>
                        </div>
                    </div>

                    <!-- Extraction Parameters -->
                    <div class="params-grid">
                        <div class="param-item">
                            <span class="param-label">ผงกาแฟ</span>
                            <span class="param-val">${recipe.dose || '18.5g'}</span>
                        </div>
                        <div class="param-item">
                            <span class="param-label">น้ำสกัด</span>
                            <span class="param-val">${recipe.yield || '36ml'}</span>
                        </div>
                        <div class="param-item">
                            <span class="param-label">เวลาสกัด</span>
                            <span class="param-val">${recipe.shotTime || '26s'}</span>
                        </div>
                        <div class="param-item">
                            <span class="param-label">อุณหภูมิ</span>
                            <span class="param-val">${recipe.temp || '93°C'}</span>
                        </div>
                    </div>

                    <div style="font-size:12px; font-weight:700; color:var(--text-muted); margin-bottom:4px;">ส่วนผสม & ปริมาณ:</div>
                    <ul class="prep-steps-list mb-2" style="list-style:disc;">
                        ${ingListHtml}
                    </ul>

                    <div style="font-size:12px; font-weight:700; color:var(--text-muted); margin-bottom:4px;">ขั้นตอนการชง:</div>
                    <ol class="prep-steps-list mb-3">
                        ${stepsHtml}
                    </ol>
                </div>

                <div class="recipe-card-footer" style="flex-wrap:wrap; gap:4px;">
                    <button class="btn btn-sm btn-primary" onclick="loadSavedRecipe(${index})">
                        <i class="fa-solid fa-calculator"></i> โหลดขึ้นคำนวณ
                    </button>
                    <button class="btn btn-sm btn-outline" onclick="openEditRecipeModal(${index})">
                        <i class="fa-solid fa-pen-to-square"></i> แก้ไขสูตร
                    </button>
                    <button class="btn btn-sm btn-outline" onclick="openRecipeQrModal(${index})">
                        <i class="fa-solid fa-qrcode"></i> QR สูตร
                    </button>
                    <button class="btn btn-sm btn-outline" onclick="printBaristaBarCard(${index})">
                        <i class="fa-solid fa-print"></i> พิมพ์การ์ด A6
                    </button>
                    <button class="btn btn-sm btn-danger btn-icon-only" onclick="deleteSavedRecipe(${index})">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>
            `;
            grid.appendChild(card);
        });
    }

    // --- Barista Recipe QR Code Modal Handlers ---
    window.openRecipeQrModal = (index) => {
        const recipe = state.savedRecipes[index];
        if (!recipe) return;

        const modal = document.getElementById('qrCodeModal');
        if (!modal) return;

        document.getElementById('qrRecipeTitle').textContent = recipe.name;

        const container = document.getElementById('qrCodeCanvasBox');
        if (!container) return;
        container.innerHTML = '';

        const compactSteps = (recipe.steps || []).slice(0, 3).join(' > ');
        const qrPayloadText = `☕ ${recipe.name}\nราคา: ฿${recipe.sellingPrice || 60}\nผง: ${recipe.dose || '18.5g'} | น้ำ: ${recipe.yield || '36ml'} | เวลา: ${recipe.shotTime || '26s'}\nวิธีชง: ${compactSteps}`;

        const downloadBtn = document.getElementById('btnDownloadQrCode');

        if (typeof QRCode !== 'undefined') {
            try {
                new QRCode(container, {
                    text: qrPayloadText,
                    width: 200,
                    height: 200,
                    colorDark: "#0f172a",
                    colorLight: "#ffffff",
                    correctLevel: QRCode.CorrectLevel.M
                });

                setTimeout(() => {
                    const canvas = container.querySelector('canvas');
                    const img = container.querySelector('img');
                    if (canvas && downloadBtn) {
                        downloadBtn.href = canvas.toDataURL("image/png");
                    } else if (img && downloadBtn) {
                        downloadBtn.href = img.src;
                    }
                }, 150);
            } catch(e) {
                renderOfflineCanvasQr(container, qrPayloadText, downloadBtn);
            }
        } else {
            renderOfflineCanvasQr(container, qrPayloadText, downloadBtn);
        }

        const ingListHtml = (recipe.ingredients || []).map(i => `<li>${i.name}: <strong>${i.useQty} ${i.useUnit}</strong></li>`).join('');
        const stepsListHtml = (recipe.steps || []).map(s => `<li>${s}</li>`).join('');

        const summaryEl = document.getElementById('qrRecipeSummaryText');
        if (summaryEl) {
            summaryEl.innerHTML = `
                <div style="background:var(--bg-input); padding:10px; border-radius:8px; border:1px solid var(--border-color); text-align:left; font-size:11px; margin-top:4px;">
                    <div style="display:flex; justify-content:space-between; font-weight:700; margin-bottom:4px; color:var(--text-main);">
                        <span>⏱️ ผง ${recipe.dose || '18.5g'} | น้ำ ${recipe.yield || '36ml'} | เวลา ${recipe.shotTime || '26s'}</span>
                        <span style="color:#d97706;">฿${recipe.sellingPrice || 60}</span>
                    </div>
                    <div style="font-weight:700; color:var(--text-muted); margin-top:4px;">🥛 ส่วนผสม:</div>
                    <ul style="margin:2px 0 6px 16px; padding:0; list-style:disc;">${ingListHtml}</ul>
                    <div style="font-weight:700; color:var(--text-muted);">👨‍🍳 ขั้นตอนการชง:</div>
                    <ol style="margin:2px 0 0 16px; padding:0;">${stepsListHtml}</ol>
                </div>
            `;
        }

        modal.classList.add('active');
    };

    function renderOfflineCanvasQr(container, text, downloadBtn) {
        const canvas = document.createElement('canvas');
        canvas.width = 200;
        canvas.height = 200;
        const ctx = canvas.getContext('2d');
        
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, 200, 200);
        ctx.fillStyle = '#0f172a';
        
        function drawMarker(x, y) {
            ctx.fillRect(x, y, 42, 42);
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(x + 6, y + 6, 30, 30);
            ctx.fillStyle = '#0f172a';
            ctx.fillRect(x + 12, y + 12, 18, 18);
        }
        drawMarker(10, 10);
        drawMarker(148, 10);
        drawMarker(10, 148);

        let hash = 0;
        for (let i = 0; i < text.length; i++) {
            hash = (hash << 5) - hash + text.charCodeAt(i);
            hash |= 0;
        }
        for (let r = 0; r < 14; r++) {
            for (let c = 0; c < 14; c++) {
                if ((r < 4 && c < 4) || (r < 4 && c > 9) || (r > 9 && c < 4)) continue;
                if (((hash >> ((r * 14 + c) % 31)) & 1) === 1) {
                    ctx.fillRect(10 + c * 13, 10 + r * 13, 11, 11);
                }
            }
        }

        container.appendChild(canvas);
        if (downloadBtn) {
            downloadBtn.href = canvas.toDataURL("image/png");
        }
    }

    document.getElementById('btnCloseQrCodeModal')?.addEventListener('click', () => {
        document.getElementById('qrCodeModal')?.classList.remove('active');
    });

    // --- Edit Recipe Modal Handlers ---
    window.openEditRecipeModal = (index) => {
        const recipe = state.savedRecipes[index];
        if (!recipe) return;

        const modal = document.getElementById('editRecipeModal');
        if (!modal) return;

        document.getElementById('editRecipeIndex').value = index;
        document.getElementById('editRecipeTitle').value = recipe.name || '';
        document.getElementById('editRecipeCategory').value = recipe.category || 'กาแฟ';
        document.getElementById('editRecipePrice').value = recipe.sellingPrice || 60;
        document.getElementById('editRecipeDose').value = recipe.dose || '18.5 กรัม';
        document.getElementById('editRecipeYield').value = recipe.yield || '36 มล.';
        document.getElementById('editRecipeTime').value = recipe.shotTime || '26 วินาที';

        const ingText = (recipe.ingredients || []).map(i => `${i.name}: ${i.useQty} ${i.useUnit}`).join('\n');
        const ingInput = document.getElementById('editRecipeIngredientsText');
        if (ingInput) ingInput.value = ingText;

        document.getElementById('editRecipeSteps').value = (recipe.steps || []).join('\n');

        modal.classList.add('active');
    };

    document.getElementById('btnCloseEditRecipeModal')?.addEventListener('click', () => {
        document.getElementById('editRecipeModal')?.classList.remove('active');
    });

    document.getElementById('formEditExistingRecipe')?.addEventListener('submit', (e) => {
        e.preventDefault();
        const index = parseInt(document.getElementById('editRecipeIndex').value);
        if (isNaN(index) || !state.savedRecipes[index]) return;

        const recipe = state.savedRecipes[index];
        recipe.name = document.getElementById('editRecipeTitle').value.trim();
        recipe.category = document.getElementById('editRecipeCategory').value;
        recipe.sellingPrice = parseFloat(document.getElementById('editRecipePrice').value) || 60;
        recipe.dose = document.getElementById('editRecipeDose').value.trim();
        recipe.yield = document.getElementById('editRecipeYield').value.trim();
        recipe.shotTime = document.getElementById('editRecipeTime').value.trim();

        const ingText = document.getElementById('editRecipeIngredientsText')?.value.trim();
        if (ingText) {
            recipe.ingredients = parseIngredientsFromText(ingText);
            let calculatedCogs = 0;
            recipe.ingredients.forEach(i => {
                const p = i.price || 0;
                const q = i.packQty || 1;
                calculatedCogs += (p / q) * (i.useQty || 0);
            });
            if (calculatedCogs > 0) recipe.cogs = calculatedCogs;
        }

        const stepsText = document.getElementById('editRecipeSteps').value.trim();
        if (stepsText) {
            recipe.steps = stepsText.split('\n').filter(s => s.trim() !== '');
        }

        // Recalculate profit margins
        const cogsVal = recipe.cogs || 25;
        recipe.grossProfit = recipe.sellingPrice - cogsVal;
        recipe.foodCostPercent = recipe.sellingPrice > 0 ? (cogsVal / recipe.sellingPrice) * 100 : 0;
        recipe.deliveryPrice = recipe.sellingPrice / (1 - 0.321);

        safeStorageSet('brewcost_saved_recipes', JSON.stringify(state.savedRecipes));
        document.getElementById('editRecipeModal')?.classList.remove('active');
        renderAll();
        alert(`บันทึกการแก้ไขสูตร "${recipe.name}" เรียบร้อยแล้ว!`);
    });

    // --- Printable Barista Bar Card A6 Function ---

    window.printBaristaBarCard = (index) => {
        const recipe = state.savedRecipes[index];
        if (!recipe) return;

        const container = document.getElementById('printableBaristaCard');
        if (!container) return;

        const ingListHtml = (recipe.ingredients || []).map(i => `<li style="margin-bottom:3px;">${i.name}: <strong>${i.useQty} ${i.useUnit}</strong></li>`).join('');
        const stepsHtml = (recipe.steps || ["ผสมส่วนผสมลงในแก้ว", "ใส่น้ำแข็งเสิร์ฟ"]).map(s => `<li style="margin-bottom:3px;">${s}</li>`).join('');

        container.innerHTML = `
            <div style="background:#fff; color:#0f172a; padding:12px; width:105mm; min-height:148mm; margin:0 auto; border:2px solid #0f172a; border-radius:8px; font-family:'Prompt', sans-serif;">
                
                <!-- Card Header -->
                <div style="border-bottom:2px solid #d97706; padding-bottom:6px; margin-bottom:8px; display:flex; justify-content:space-between; align-items:center;">
                    <div>
                        <h2 style="font-size:15px; font-weight:800; color:#0f172a; margin:0;">☕ ${recipe.name}</h2>
                        <span style="font-size:10px; color:#475569;">หมวดหมู่: <strong>${recipe.category || 'กาแฟ'}</strong></span>
                    </div>
                    <span style="background:#fef3c7; color:#92400e; font-size:10px; padding:2px 6px; border-radius:4px; font-weight:800; border:1px solid #fde68a;">
                        ฿${(recipe.sellingPrice || 60).toFixed(0)}
                    </span>
                </div>

                <!-- Extraction Parameters -->
                <div style="display:grid; grid-template-columns:repeat(4, 1fr); gap:4px; background:#f8fafc; border:1px solid #cbd5e1; padding:6px; border-radius:6px; text-align:center; margin-bottom:8px; font-size:10px;">
                    <div>
                        <span style="color:#64748b; font-size:8px; display:block;">ผงกาแฟ</span>
                        <strong style="font-size:11px; color:#0f172a;">${recipe.dose || '18.5g'}</strong>
                    </div>
                    <div>
                        <span style="color:#64748b; font-size:8px; display:block;">น้ำสกัด</span>
                        <strong style="font-size:11px; color:#0f172a;">${recipe.yield || '36ml'}</strong>
                    </div>
                    <div>
                        <span style="color:#64748b; font-size:8px; display:block;">เวลาสกัด</span>
                        <strong style="font-size:11px; color:#0f172a;">${recipe.shotTime || '26s'}</strong>
                    </div>
                    <div>
                        <span style="color:#64748b; font-size:8px; display:block;">อุณหภูมิ</span>
                        <strong style="font-size:11px; color:#0f172a;">${recipe.temp || '93°C'}</strong>
                    </div>
                </div>

                <!-- Ingredients Section -->
                <div style="margin-bottom:8px;">
                    <div style="font-size:11px; font-weight:800; color:#b45309; margin-bottom:4px; border-bottom:1px solid #fde68a; padding-bottom:2px;">
                        🥛 สัดส่วนวัตถุดิบ (Recipe Ingredients):
                    </div>
                    <ul style="font-size:10px; padding-left:14px; margin:0; color:#1e293b; list-style:disc;">
                        ${ingListHtml}
                    </ul>
                </div>

                <!-- Step-by-Step Instructions -->
                <div style="margin-bottom:8px;">
                    <div style="font-size:11px; font-weight:800; color:#047857; margin-bottom:4px; border-bottom:1px solid #a7f3d0; padding-bottom:2px;">
                        👨‍🍳 ขั้นตอนการชง (Prep Instructions):
                    </div>
                    <ol style="font-size:10px; padding-left:14px; margin:0; color:#1e293b;">
                        ${stepsHtml}
                    </ol>
                </div>
            </div>
        `;

        window.print();
    };

    function renderSavedDropdownOptions() {
        const group = document.getElementById('savedOptionsGroup');
        if (!group) return;

        group.innerHTML = '';
        if (!Array.isArray(state.savedRecipes) || state.savedRecipes.length === 0) {
            group.innerHTML = '<option value="" disabled>(ไม่มีสูตรที่บันทึกไว้ในคลัง)</option>';
            return;
        }

        state.savedRecipes.forEach((recipe, index) => {
            const opt = document.createElement('option');
            opt.value = `saved:${index}`;
            opt.textContent = `☕ ${recipe.name} (฿${(recipe.sellingPrice || 0).toFixed(0)})`;
            group.appendChild(opt);
        });
    }

    function renderMasterIngredientsTable() {
        const tbody = document.getElementById('masterIngredientsList');
        if (!tbody) return;
        tbody.innerHTML = '';

        if (!Array.isArray(state.masterIngredients) || state.masterIngredients.length === 0) {
            tbody.innerHTML = `<tr><td colspan="6" class="text-center text-muted py-4">ยังไม่มีวัตถุดิบในคลังกลาง กดปุ่ม "+ เพิ่มวัตถุดิบใหม่เข้าคลัง" หรืออัปโหลดไฟล์ Excel เพื่อเริ่มเพิ่มข้อมูล</td></tr>`;
            return;
        }

        state.masterIngredients.forEach((item, index) => {
            const unitCost = item.packQty > 0 ? (item.price / item.packQty) : 0;
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>
                    <input type="text" class="form-control" value="${item.name}" onchange="updateMasterIngredient(${index}, 'name', this.value)">
                </td>
                <td>
                    <input type="number" class="form-control" value="${item.price}" min="0" step="0.5" onchange="updateMasterIngredient(${index}, 'price', this.value)">
                </td>
                <td>
                    <input type="number" class="form-control" value="${item.packQty}" min="1" onchange="updateMasterIngredient(${index}, 'packQty', this.value)">
                </td>
                <td>
                    <input type="text" class="form-control width-80" value="${item.packUnit}" onchange="updateMasterIngredient(${index}, 'packUnit', this.value)">
                </td>
                <td class="bold color-amber">฿${unitCost.toFixed(3)} / ${item.packUnit}</td>
                <td>
                    <button class="btn btn-danger btn-icon-only" onclick="removeMasterIngredient(${index})"><i class="fa-solid fa-trash"></i></button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }

    function renderIngredientsTable() {
        const tbody = document.getElementById('ingredientsList');
        if (!tbody) return;
        tbody.innerHTML = '';

        if (!Array.isArray(state.ingredients) || state.ingredients.length === 0) {
            tbody.innerHTML = `<tr><td colspan="6" class="text-center text-muted py-4">ยังไม่มีวัตถุดิบในสูตร กดปุ่ม "+ เพิ่มวัตถุดิบ" หรือ "+ เลือกจากคลังวัตถุดิบกลาง" เพื่อเริ่มสร้างสูตร</td></tr>`;
            return;
        }

        const mult = getScaleMultiplier();

        state.ingredients.forEach((item, index) => {
            const priceVal = item.price !== undefined && item.price !== null ? item.price : 0;
            const packQtyVal = item.packQty || 1;
            const packUnitVal = item.packUnit || 'กรัม';
            const useQtyVal = item.useQty || 0;
            const useUnitVal = item.useUnit || packUnitVal;

            item.price = priceVal;
            item.packQty = packQtyVal;
            item.packUnit = packUnitVal;
            item.useQty = useQtyVal;
            item.useUnit = useUnitVal;

            const costPerCup = calculateIngredientCost(item);
            const scaledQty = item.isPackage ? useQtyVal : (useQtyVal * mult);

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>
                    <input type="text" class="form-control" value="${item.name}" onchange="updateIngredient(${index}, 'name', this.value)" style="width:100%;">
                </td>
                <td>
                    <input type="number" class="form-control" value="${priceVal}" min="0" step="0.5" onchange="updateIngredient(${index}, 'price', this.value)" style="width:100%;">
                </td>
                <td>
                    <div style="display:flex; align-items:center; gap:3px;">
                        <input type="number" class="form-control" value="${packQtyVal}" min="1" onchange="updateIngredient(${index}, 'packQty', this.value)" style="width:72px;">
                        <input type="text" class="form-control" value="${packUnitVal}" onchange="updateIngredient(${index}, 'packUnit', this.value)" style="width:58px;">
                    </div>
                </td>
                <td>
                    <div style="display:flex; align-items:center; gap:4px;">
                        <input type="number" class="form-control" value="${useQtyVal}" min="0" step="0.1" onchange="updateIngredient(${index}, 'useQty', this.value)" style="width:72px;">
                        <div style="display:flex; flex-direction:column; justify-content:center; line-height:1.1; white-space:nowrap;">
                            <span style="font-size:11px; color:var(--text-main); font-weight:600;">${useUnitVal}</span>
                            ${mult !== 1.0 && !item.isPackage ? `<small class="color-amber" style="font-size:10px; font-weight:700;">(${scaledQty.toFixed(1)})</small>` : ''}
                        </div>
                    </div>
                </td>
                <td class="bold color-amber" style="text-align:right; white-space:nowrap; font-size:12px;">฿${costPerCup.toFixed(2)}</td>
                <td style="text-align:center;">
                    <button class="btn btn-danger btn-icon-only" onclick="removeIngredient(${index})"><i class="fa-solid fa-trash"></i></button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }

    function renderOverheadList() {
        const container = document.getElementById('overheadList');
        if (!container) return;
        container.innerHTML = '';

        if (!Array.isArray(state.overheads) || state.overheads.length === 0) {
            container.innerHTML = '<div class="text-center text-muted py-3">ยังไม่มีรายการค่าใช้จ่ายประจำ กดปุ่ม "+ เพิ่มรายการค่าใช้จ่ายประจำ" ด้านล่างเพื่อเพิ่มข้อมูล</div>';
            return;
        }

        state.overheads.forEach((ov, index) => {
            const div = document.createElement('div');
            div.className = 'form-row mb-2 align-items-center';
            div.innerHTML = `
                <div class="col" style="flex:2;">
                    <input type="text" class="form-control" value="${ov.name}" onchange="updateOverhead(${index}, 'name', this.value)">
                </div>
                <div class="col" style="flex:1;">
                    <div class="input-currency">
                        <span class="currency-symbol">฿</span>
                        <input type="number" class="form-control" value="${ov.amount}" min="0" onchange="updateOverhead(${index}, 'amount', this.value)">
                    </div>
                </div>
                <div style="width:40px;">
                    <button class="btn btn-danger btn-icon-only" onclick="removeOverhead(${index})"><i class="fa-solid fa-trash"></i></button>
                </div>
            `;
            container.appendChild(div);
        });
    }

    function renderInvestmentList() {
        const tbody = document.getElementById('investmentIngredientsList');
        if (!tbody) return;
        tbody.innerHTML = '';

        if (!Array.isArray(state.investments) || state.investments.length === 0) {
            tbody.innerHTML = `<tr><td colspan="3" class="text-center text-muted py-3">ยังไม่มีรายการเงินลงทุนแรกเริ่ม กดปุ่ม "+ เพิ่มรายการเงินลงทุน" ด้านบนเพื่อเพิ่มข้อมูล</td></tr>`;
            return;
        }

        state.investments.forEach((inv, index) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>
                    <input type="text" class="form-control" value="${inv.name}" onchange="updateInvestment(${index}, 'name', this.value)">
                </td>
                <td>
                    <div class="input-currency">
                        <span class="currency-symbol">฿</span>
                        <input type="number" class="form-control" value="${inv.amount}" min="0" step="1000" onchange="updateInvestment(${index}, 'amount', this.value)">
                    </div>
                </td>
                <td>
                    <button class="btn btn-danger btn-icon-only" onclick="removeInvestment(${index})"><i class="fa-solid fa-trash"></i></button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }

    function renderSavedRecipesTable() {
        const tbody = document.getElementById('savedRecipesList');
        if (!tbody) return;
        tbody.innerHTML = '';

        if (!Array.isArray(state.savedRecipes) || state.savedRecipes.length === 0) {
            tbody.innerHTML = `<tr><td colspan="7" class="text-center text-muted py-4">ยังไม่มีข้อมูลเมนูที่บันทึกไว้ อัปโหลดไฟล์ หรือคลิก "+ เพิ่มสูตรเมนูกาแฟ" เพื่อเพิ่มรายการ</td></tr>`;
            return;
        }

        state.savedRecipes.forEach((recipe, index) => {
            const tr = document.createElement('tr');
            const fc = recipe.foodCostPercent || 0;
            const badgeHtml = getMarginBadgeHtml(fc);
            tr.innerHTML = `
                <td class="bold">${recipe.name}</td>
                <td class="color-amber">฿${(recipe.cogs || 0).toFixed(2)}</td>
                <td>฿${(recipe.sellingPrice || 0).toFixed(2)}</td>
                <td class="color-emerald">฿${(recipe.grossProfit || 0).toFixed(2)}</td>
                <td>${badgeHtml} <small class="text-muted">(${fc.toFixed(1)}%)</small></td>
                <td class="color-blue bold">฿${Math.ceil(recipe.deliveryPrice || 0)}</td>
                <td>
                    <button class="btn btn-sm btn-outline" onclick="loadSavedRecipe(${index})"><i class="fa-solid fa-folder-open"></i> โหลด</button>
                    <button class="btn btn-sm btn-danger btn-icon-only" onclick="deleteSavedRecipe(${index})"><i class="fa-solid fa-trash"></i></button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }

    // Master Stock Global Functions
    window.updateMasterIngredient = (index, field, value) => {
        const masterItem = state.masterIngredients[index];
        if (!masterItem) return;

        if (field === 'price' || field === 'packQty') {
            masterItem[field] = parseFloat(value) || 0;
        } else {
            masterItem[field] = value;
        }
        localStorage.setItem('brewcost_master_stock', JSON.stringify(state.masterIngredients));

        state.ingredients.forEach(ing => {
            if (ing.masterId === masterItem.id || ing.name === masterItem.name) {
                ing.price = masterItem.price;
                ing.packQty = masterItem.packQty;
                ing.packUnit = masterItem.packUnit;
            }
        });

        renderAll();
    };

    window.removeMasterIngredient = (index) => {
        state.masterIngredients.splice(index, 1);
        localStorage.setItem('brewcost_master_stock', JSON.stringify(state.masterIngredients));
        renderAll();
    };

    document.getElementById('btnAddMasterItem')?.addEventListener('click', () => {
        const newItem = {
            id: 'm_' + Date.now(),
            name: "วัตถุดิบใหม่ในคลัง",
            price: 100,
            packQty: 1000,
            packUnit: "กรัม"
        };
        state.masterIngredients.push(newItem);
        localStorage.setItem('brewcost_master_stock', JSON.stringify(state.masterIngredients));
        renderAll();
    });

    const masterModal = document.getElementById('masterSelectModal');
    document.getElementById('btnSelectFromMaster')?.addEventListener('click', () => {
        renderMasterSelectList();
        masterModal.classList.add('active');
    });

    document.getElementById('btnCloseMasterModal')?.addEventListener('click', () => {
        masterModal.classList.remove('active');
    });

    function renderMasterSelectList() {
        const tbody = document.getElementById('masterSelectList');
        if (!tbody) return;
        tbody.innerHTML = '';

        if (state.masterIngredients.length === 0) {
            tbody.innerHTML = '<tr><td colspan="4" class="text-center text-muted py-4">ยังไม่มีวัตถุดิบในคลังกลาง กรุณาเพิ่มวัตถุดิบในแท็บ "คลังวัตถุดิบกลาง" ก่อน</td></tr>';
            return;
        }

        state.masterIngredients.forEach(master => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td class="bold">${master.name}</td>
                <td>฿${master.price.toFixed(2)}</td>
                <td>${master.packQty} ${master.packUnit}</td>
                <td>
                    <button class="btn btn-sm btn-primary" onclick="addMasterToRecipe('${master.id}')">
                        <i class="fa-solid fa-plus"></i> เลือกใส่สูตร
                    </button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }

    window.addMasterToRecipe = (masterId) => {
        const master = state.masterIngredients.find(m => m.id === masterId);
        if (!master) return;

        state.ingredients.push({
            id: Date.now(),
            masterId: master.id,
            name: master.name,
            price: master.price,
            packQty: master.packQty,
            packUnit: master.packUnit,
            useQty: master.packUnit === 'กรัม' ? 15 : (master.packUnit === 'มล.' ? 100 : 1),
            useUnit: master.packUnit,
            isPackage: false
        });

        localStorage.setItem('brewcost_current_ingredients', JSON.stringify(state.ingredients));
        masterModal.classList.remove('active');
        renderAll();
    };

    // --- Chart Rendering Functions ---

    function getTextColor() {
        return document.body.classList.contains('dark-mode') ? '#a8a29e' : '#6b5e57';
    }

    function getGridColor() {
        return document.body.classList.contains('dark-mode') ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)';
    }

    function renderRecipeChart() {
        if (typeof Chart === 'undefined') return;
        const ctx = document.getElementById('recipeChart')?.getContext('2d');
        if (!ctx) return;

        const labels = state.ingredients.map(i => i.name);
        const data = state.ingredients.map(i => calculateIngredientCost(i));

        if (recipeChartInstance) {
            recipeChartInstance.destroy();
        }

        recipeChartInstance = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: labels.length > 0 ? labels : ['ไม่มีวัตถุดิบ'],
                datasets: [{
                    data: data.length > 0 ? data : [1],
                    backgroundColor: labels.length > 0 ? [
                        '#d97706', '#f59e0b', '#2563eb', '#059669', '#7c3aed', '#ec4899', '#6366f1', '#14b8a6'
                    ] : ['#e2e8f0'],
                    borderWidth: 2,
                    borderColor: document.body.classList.contains('dark-mode') ? '#1c1917' : '#ffffff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '52%',
                layout: {
                    padding: { top: 5, bottom: 10, left: 10, right: 10 }
                },
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: getTextColor(),
                            font: { family: 'Prompt', size: 11, weight: '600' },
                            boxWidth: 12,
                            padding: 10
                        }
                    }
                }
            }
        });
    }

    function renderOverheadChart() {
        if (typeof Chart === 'undefined') return;
        const ctx = document.getElementById('overheadChart')?.getContext('2d');
        if (!ctx) return;

        const res = calculateTotals();
        const labels = state.overheads.map(o => o.name).concat(['ค่าเสื่อมราคาอุปกรณ์ (CapEx)']);
        const data = state.overheads.map(o => parseFloat(o.amount) || 0).concat([res.monthlyDepreciation]);

        if (overheadChartInstance) {
            overheadChartInstance.destroy();
        }

        overheadChartInstance = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: labels,
                datasets: [{
                    data: data,
                    backgroundColor: [
                        '#7c3aed', '#2563eb', '#059669', '#d97706', '#ec4899', '#e11d48', '#64748b'
                    ],
                    borderWidth: 2,
                    borderColor: document.body.classList.contains('dark-mode') ? '#1c1917' : '#ffffff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                layout: {
                    padding: { top: 5, bottom: 10, left: 10, right: 10 }
                },
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: getTextColor(),
                            font: { family: 'Prompt', size: 11, weight: '600' },
                            boxWidth: 12,
                            padding: 10
                        }
                    }
                }
            }
        });
    }

    function renderBreakEvenChart(res) {
        if (typeof Chart === 'undefined') return;
        const canvas = document.getElementById('breakEvenChart');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        try {
            const targetCups = res.targetCupsMonth > 0 ? res.targetCupsMonth : (res.beCupsMonth > 0 ? res.beCupsMonth * 1.4 : 2000);
            const maxCups = Math.max(Math.ceil(targetCups * 1.25), 500);
            const numPoints = 6;
            
            const cupArray = [];
            const step = Math.ceil(maxCups / numPoints);
            
            for (let i = 0; i <= numPoints; i++) {
                cupArray.push(i * step);
            }

            if (res.beCupsMonth > 0 && !cupArray.includes(res.beCupsMonth)) {
                cupArray.push(res.beCupsMonth);
            }
            if (res.targetCupsMonth > 0 && !cupArray.includes(res.targetCupsMonth)) {
                cupArray.push(res.targetCupsMonth);
            }
            cupArray.sort((a, b) => a - b);

            const labels = cupArray.map(c => `${c.toLocaleString()} แก้ว`);
            const revenueData = cupArray.map(c => Math.round(c * res.avgPrice));
            const totalCostData = cupArray.map(c => Math.round(res.totalFixedOverhead + (c * res.avgCogs)));
            const targetCostRevenueData = cupArray.map(c => Math.round(res.totalFixedOverhead + (parseFloat(state.targetProfit) || 0) + (c * res.avgCogs)));
            const fixedCostData = cupArray.map(c => Math.round(res.totalFixedOverhead));

            if (breakEvenChartInstance) {
                breakEvenChartInstance.destroy();
            }

            breakEvenChartInstance = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [
                        {
                            label: '🟢 รายได้รวม (Total Revenue)',
                            data: revenueData,
                            borderColor: '#059669',
                            backgroundColor: 'rgba(5, 150, 105, 0.1)',
                            fill: true,
                            tension: 0.1,
                            borderWidth: 3,
                            pointRadius: 4,
                            pointHoverRadius: 7
                        },
                        {
                            label: '🔴 ต้นทุนรวมคุ้มทุน (Fixed + Variable)',
                            data: totalCostData,
                            borderColor: '#e11d48',
                            borderDash: [4, 4],
                            fill: false,
                            tension: 0.1,
                            borderWidth: 2.5,
                            pointRadius: 4
                        },
                        {
                            label: '🏆 ยอดขายรวมตามเป้าหมายกำไร',
                            data: targetCostRevenueData,
                            borderColor: '#2563eb',
                            borderDash: [2, 2],
                            fill: false,
                            tension: 0.1,
                            borderWidth: 2,
                            pointRadius: 4
                        },
                        {
                            label: '🟣 ค่าใช้จ่ายประจำคงที่ (Fixed Overhead)',
                            data: fixedCostData,
                            borderColor: '#7c3aed',
                            borderDash: [6, 6],
                            fill: false,
                            borderWidth: 1.5,
                            pointRadius: 0
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        x: {
                            ticks: { color: getTextColor(), font: { family: 'Prompt', size: 11 } },
                            grid: { color: getGridColor() }
                        },
                        y: {
                            ticks: {
                                color: getTextColor(),
                                font: { family: 'Prompt', size: 11 },
                                callback: function(value) {
                                    return '฿' + Number(value).toLocaleString();
                                }
                            },
                            grid: { color: getGridColor() }
                        }
                    },
                    plugins: {
                        legend: {
                            position: 'top',
                            labels: { color: getTextColor(), font: { family: 'Prompt', size: 11 }, boxWidth: 12 }
                        }
                    }
                }
            });
        } catch (e) {
            console.error("Error rendering break-even chart:", e);
        }
    }

    // --- Printable Report Generator Function ---

    function generateWholeShopReport() {
        const container = document.getElementById('printableReportContainer');
        if (!container) return;

        const res = calculateTotals();
        const dateStr = new Date().toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' });

        const recipes = Array.isArray(state.savedRecipes) && state.savedRecipes.length > 0
            ? state.savedRecipes
            : [{
                name: state.recipeName || "กาแฟลาเต้เย็น (16oz)",
                category: "กาแฟเอสเพรสโซ่",
                sellingPrice: res.customSelling || 65,
                cogs: res.totalCogs || 29.47,
                grossProfit: res.grossProfit || 35.53,
                foodCostPercent: res.actualFoodCostPercent || 45.3,
                deliveryPrice: res.deliveryPrice || 96,
                salesMix: 50
            }];

        const defaultMixes = [35, 25, 15, 12, 8, 5];
        let totalWeight = 0;
        
        const rankedRecipes = recipes.map((r, idx) => {
            const mix = r.salesMix || defaultMixes[idx] || 10;
            totalWeight += mix;
            return { ...r, salesMixRatio: mix };
        });

        rankedRecipes.forEach(r => {
            r.salesMixPercent = (r.salesMixRatio / totalWeight) * 100;
        });

        rankedRecipes.sort((a, b) => b.salesMixPercent - a.salesMixPercent);

        const targetCupsMonth = res.targetCupsMonth > 0 ? res.targetCupsMonth : (res.beCupsMonth > 0 ? res.beCupsMonth : 1500);

        let totalEstimatedRevenue = 0;
        let recipeRowsHtml = '';

        rankedRecipes.forEach((recipe, idx) => {
            const cupVol = Math.round(targetCupsMonth * (recipe.salesMixPercent / 100));
            const rev = cupVol * (recipe.sellingPrice || 0);
            totalEstimatedRevenue += rev;

            let rankBadgeHtml = `<span style="color:#64748b; font-weight:700;">#${idx + 1}</span>`;
            let topBadgeHtml = '';

            if (idx === 0) {
                rankBadgeHtml = `<span class="badge-rank-1">🥇 #1</span>`;
                topBadgeHtml = `<span style="background:#fef3c7; color:#92400e; font-size:9px; padding:1px 4px; border-radius:3px; font-weight:700; margin-left:4px;">ขายดีที่สุด</span>`;
            } else if (idx === 1) {
                rankBadgeHtml = `<span class="badge-rank-2">🥈 #2</span>`;
            } else if (idx === 2) {
                rankBadgeHtml = `<span class="badge-rank-3">🥉 #3</span>`;
            }

            const cogsVal = recipe.cogs || 25;
            const priceVal = recipe.sellingPrice || 60;
            const gpVal = priceVal - cogsVal;

            recipeRowsHtml += `
                <tr ${idx === 0 ? 'style="background:#fffbebf0;"' : ''}>
                    <td style="text-align:center;">${rankBadgeHtml}</td>
                    <td style="font-weight:700; color:#0f172a;">
                        ${recipe.name} ${topBadgeHtml}
                    </td>
                    <td style="text-align:right;">฿${priceVal.toFixed(2)}</td>
                    <td style="text-align:right; color:#e11d48;">฿${cogsVal.toFixed(2)}</td>
                    <td style="text-align:right; font-weight:700; color:#059669;">฿${gpVal.toFixed(2)}</td>
                    <td style="text-align:center; font-weight:600; color:#d97706;">${recipe.salesMixPercent.toFixed(1)}%</td>
                    <td style="text-align:center; font-weight:700; color:#1e293b;">${cupVol.toLocaleString()} แก้ว</td>
                    <td style="text-align:right; font-weight:700; color:#047857;">฿${rev.toLocaleString('th-TH', {minimumFractionDigits: 2})}</td>
                </tr>
            `;
        });

        const topRecipeName = rankedRecipes[0]?.name || "กาแฟลาเต้เย็น";
        const topRecipeMix = rankedRecipes[0]?.salesMixPercent.toFixed(1) || "35.0";

        container.innerHTML = `
            <div style="background:#fff; color:#0f172a; padding:10px; font-family:'Prompt', sans-serif;">
                
                <!-- Report Header -->
                <div class="print-header">
                    <div>
                        <h1 class="print-title">☕ BrewCost <span style="background:#fef3c7; color:#92400e; font-size:12px; padding:2px 6px; border-radius:4px; font-weight:800;">PRO</span></h1>
                        <p class="print-subtitle">รายงานวิเคราะห์สรุปยอดขาย จัดอันดับเมนูขายดี และสัดส่วนต้นทุนรวมทั้งร้าน (Whole Shop Sales & Best-Seller Report)</p>
                    </div>
                    <div style="text-align:right; font-size:11px; color:#475569;">
                        <p><strong>วันที่ออกรายงาน:</strong> ${dateStr}</p>
                        <p><strong>ขอบเขตรายงาน:</strong> สรุปยอดขาย & อันดับขายดีรวมทั้งร้าน</p>
                    </div>
                </div>

                <!-- KPI Banner -->
                <div class="print-grid-4">
                    <div class="print-kpi-box print-kpi-amber">
                        <span style="font-size:10px; font-weight:700; display:block;">เงินลงทุนแรกเริ่ม (CapEx)</span>
                        <strong style="font-size:15px; display:block; margin-top:2px;">฿${res.totalCapEx.toLocaleString('th-TH', {maximumFractionDigits: 0})}</strong>
                        <span style="font-size:9px;">เครื่องชง/เครื่องบด/ตกแต่ง</span>
                    </div>
                    <div class="print-kpi-box print-kpi-emerald">
                        <span style="font-size:10px; font-weight:700; display:block;">🏆 เมนูขายดีอันดับ 1</span>
                        <strong style="font-size:12px; display:block; margin-top:2px;">${topRecipeName}</strong>
                        <span style="font-size:9px; font-weight:700;">สัดส่วนขาย ${topRecipeMix}% ของร้าน</span>
                    </div>
                    <div class="print-kpi-box print-kpi-slate">
                        <span style="font-size:10px; font-weight:700; display:block;">ประมาณการขายรวม</span>
                        <strong style="font-size:15px; display:block; margin-top:2px;">${targetCupsMonth.toLocaleString()} แก้ว/เดือน</strong>
                        <span style="font-size:9px;">เฉลี่ย ${Math.ceil(targetCupsMonth / 30)} แก้ว/วัน</span>
                    </div>
                    <div class="print-kpi-box print-kpi-purple">
                        <span style="font-size:10px; font-weight:700; display:block;">ประมาณการยอดขายรวม</span>
                        <strong style="font-size:15px; display:block; margin-top:2px;">฿${totalEstimatedRevenue.toLocaleString('th-TH', {maximumFractionDigits: 0})} / เดือน</strong>
                        <span style="font-size:9px;">เป้าหมายกำไร ฿${(parseFloat(state.targetProfit) || 30000).toLocaleString()}</span>
                    </div>
                </div>

                <!-- Best-Seller Ranking Table -->
                <div style="margin-bottom:14px;">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
                        <h3 style="font-size:12px; font-weight:700; color:#0f172a; margin:0;">🏆 จัดอันดับเมนูขายดี & ประมาณการยอดขายรายแก้ว (Best-Seller Ranking & Sales Volume)</h3>
                        <span style="font-size:10px; color:#d97706;">*เรียงตามสัดส่วนปริมาณแก้วขายดี</span>
                    </div>
                    <table class="print-table">
                        <thead>
                            <tr>
                                <th style="width:45px; text-align:center;">อันดับ</th>
                                <th>ชื่อเมนูเครื่องดื่ม</th>
                                <th style="width:75px; text-align:right;">ราคาขาย</th>
                                <th style="width:75px; text-align:right;">ต้นทุน (COGS)</th>
                                <th style="width:75px; text-align:right;">กำไร/แก้ว</th>
                                <th style="width:80px; text-align:center;">สัดส่วนขาย (%)</th>
                                <th style="width:95px; text-align:center;">ประมาณการขาย</th>
                                <th style="width:110px; text-align:right;">ยอดขายรวม/เดือน</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${recipeRowsHtml}
                            <tr style="background:#f8fafc; font-weight:700;">
                                <td colspan="2" style="text-align:right;">รวมยอดทั้งร้าน (100% Sales Volume):</td>
                                <td style="text-align:right;">฿${res.avgPrice.toFixed(2)}*</td>
                                <td style="text-align:right; color:#e11d48;">฿${res.avgCogs.toFixed(2)}*</td>
                                <td style="text-align:right; color:#059669;">฿${res.contributionMarginPerCup.toFixed(2)}*</td>
                                <td style="text-align:center; color:#d97706;">100%</td>
                                <td style="text-align:center;">${targetCupsMonth.toLocaleString()} แก้ว</td>
                                <td style="text-align:right; color:#047857; font-size:12px; font-weight:800;">฿${totalEstimatedRevenue.toLocaleString('th-TH', {minimumFractionDigits: 2})}</td>
                            </tr>
                        </tbody>
                    </table>
                    <small style="font-size:9px; color:#94a3b8;">* หมายเหตุ: เครื่องหมาย (*) คือราคาขายและต้นทุนถัวเฉลี่ยต่อแก้วรวมทั้งร้าน</small>
                </div>

                <!-- Break-Even & Fixed Overhead Box -->
                <div style="background:#faf5ff; border:1px solid #e9d5ff; padding:10px; border-radius:6px; margin-bottom:14px;">
                    <h3 style="font-size:12px; font-weight:700; color:#581c87; margin-bottom:6px;">📊 สรุปจุดคุ้มทุนและเป้าหมายยอดขายร้าน (Fixed Overhead & Profit Targets)</h3>
                    <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; font-size:11px;">
                        <div style="background:#fff; border:1px solid #e9d5ff; padding:8px; border-radius:4px;">
                            <span style="color:#64748b; font-weight:600; display:block;">ค่าใช้จ่ายคงที่ประจำเดือน (Overhead รวมค่าเสื่อม CapEx):</span>
                            <strong style="font-size:13px; color:#6b21a8; display:block; margin-top:2px;">฿${res.totalFixedOverhead.toLocaleString('th-TH', {minimumFractionDigits: 2})} / เดือน</strong>
                            <span style="font-size:9px; color:#94a3b8;">(ค่าใช้จ่ายประจำ ฿${(res.totalFixedOverhead - res.monthlyDepreciation).toLocaleString()} + ค่าเสื่อม CapEx ฿${res.monthlyDepreciation.toLocaleString()})</span>
                        </div>
                        <div style="background:#fff; border:1px solid #e9d5ff; padding:8px; border-radius:4px;">
                            <span style="color:#64748b; font-weight:600; display:block;">⚖️ ยอดขายรวมจุดคุ้มทุนพอดี (Break-Even):</span>
                            <strong style="font-size:13px; color:#047857; display:block; margin-top:2px;">${res.beCupsMonth.toLocaleString()} แก้ว/เดือน (${res.beCupsDay} แก้ว/วัน)</strong>
                            <span style="font-size:9px; color:#475569;">คิดเป็นยอดขายรวมคุ้มทุน: <strong>฿${res.beRevenueMonth.toLocaleString('th-TH', {minimumFractionDigits: 2})} / เดือน</strong></span>
                        </div>
                    </div>
                    <div style="margin-top:8px; background:#ecfdf5; border:1px solid #a7f3d0; padding:6px 10px; border-radius:4px; display:flex; justify-content:space-between; align-items:center; font-size:11px;">
                        <span style="font-weight:700; color:#065f46;">🏆 ยอดขายรวมเป้าหมายกำไรสุทธิ ฿${(parseFloat(state.targetProfit) || 30000).toLocaleString()} / เดือน:</span>
                        <div style="text-align:right;">
                            <strong style="color:#047857; font-size:12px;">${res.targetCupsMonth.toLocaleString()} แก้ว/เดือน (${res.targetCupsDay} แก้ว/วัน)</strong>
                            <span style="font-size:9px; color:#475569; display:block;">คิดเป็นยอดขายรวม: <strong>฿${res.targetRevenueMonth.toLocaleString('th-TH', {minimumFractionDigits: 2})} / เดือน</strong></span>
                        </div>
                    </div>
                </div>

                <!-- Footer -->
                <div style="border-top:1px solid #cbd5e1; padding-top:6px; display:flex; justify-content:space-between; font-size:9px; color:#94a3b8;">
                    <span>เอกสารรายงานจัดอันดับขายดีและประมาณการยอดขาย BrewCost Pro Cafe Management System</span>
                    <span>หน้า 1 จาก 1</span>
                </div>

            </div>
        `;
    }

    // --- File Upload & Import Logic ---

    const btnUploadFile = document.getElementById('btnUploadFile');
    const fileInputRecipe = document.getElementById('fileInputRecipe');

    btnUploadFile?.addEventListener('click', () => {
        fileInputRecipe.click();
    });

    fileInputRecipe?.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const content = event.target.result;
                if (file.name.toLowerCase().endsWith('.json')) {
                    parseAndImportJSON(content);
                } else if (file.name.toLowerCase().endsWith('.csv')) {
                    parseAndImportCSV(content);
                } else {
                    alert('รองรับเฉพาะไฟล์ .json และ .csv เท่านั้น');
                }
            } catch (err) {
                alert('เกิดข้อผิดพลาดในการอ่านไฟล์: ' + err.message);
            }
            fileInputRecipe.value = '';
        };
        reader.readAsText(file, 'UTF-8');
    });

    function parseAndImportJSON(jsonText) {
        const data = JSON.parse(jsonText);
        let importedList = Array.isArray(data) ? data : [data];

        let addedCount = 0;
        importedList.forEach(item => {
            if (!item.name || !item.ingredients) return;

            const ingredients = item.ingredients.map((ing, idx) => {
                const ingName = ing.name || "วัตถุดิบ";
                const masterMatch = state.masterIngredients.find(m => m.name.includes(ingName) || ingName.includes(m.name));
                return {
                    id: Date.now() + idx,
                    name: ingName,
                    price: ing.price !== undefined ? parseFloat(ing.price) : (masterMatch ? masterMatch.price : 100),
                    packQty: ing.packQty !== undefined ? parseFloat(ing.packQty) : (masterMatch ? masterMatch.packQty : 1000),
                    packUnit: ing.packUnit || (masterMatch ? masterMatch.packUnit : "กรัม"),
                    useQty: parseFloat(ing.useQty) || 0,
                    useUnit: ing.useUnit || "กรัม",
                    isPackage: ing.isPackage || false
                };
            });

            let rawCost = 0;
            ingredients.forEach(i => {
                rawCost += (i.price / i.packQty) * i.useQty;
            });
            const wastage = parseFloat(item.wastagePercent) || 5;
            const cogs = rawCost * (1 + wastage / 100);
            const sellingPrice = parseFloat(item.sellingPrice) || 60;
            const grossProfit = sellingPrice - cogs;
            const fc = sellingPrice > 0 ? (cogs / sellingPrice) * 100 : 0;
            const deliveryPrice = sellingPrice / (1 - 0.321);

            const recipeObj = {
                id: Date.now() + Math.random(),
                name: item.name,
                category: item.category || "กาแฟเอสเพรสโซ่",
                dose: item.dose || "18.5 กรัม",
                yield: item.yield || "36 มล.",
                shotTime: item.shotTime || "26 วินาที",
                temp: item.temp || "93°C",
                steps: item.steps || [
                    "ผสมส่วนผสมตามสัดส่วนลงในแก้ว",
                    "ใส่น้ำแข็งเต็มแก้วแล้วเสิร์ฟ"
                ],
                ingredients: ingredients,
                cogs: cogs,
                sellingPrice: sellingPrice,
                grossProfit: grossProfit,
                foodCostPercent: fc,
                deliveryPrice: deliveryPrice,
                salesMix: item.salesMix || 20
            };

            state.savedRecipes.push(recipeObj);
            addedCount++;
        });

        if (addedCount > 0) {
            localStorage.setItem('brewcost_saved_recipes', JSON.stringify(state.savedRecipes));
            
            const lastAdded = importedList[0];
            state.recipeName = lastAdded.name;
            state.ingredients = lastAdded.ingredients.map((ing, idx) => {
                const ingName = ing.name || "วัตถุดิบ";
                const masterMatch = state.masterIngredients.find(m => m.name.includes(ingName) || ingName.includes(m.name));
                return {
                    id: Date.now() + idx,
                    name: ingName,
                    price: ing.price !== undefined ? parseFloat(ing.price) : (masterMatch ? masterMatch.price : 100),
                    packQty: ing.packQty !== undefined ? parseFloat(ing.packQty) : (masterMatch ? masterMatch.packQty : 1000),
                    packUnit: ing.packUnit || (masterMatch ? masterMatch.packUnit : "กรัม"),
                    useQty: parseFloat(ing.useQty) || 0,
                    useUnit: ing.useUnit || "กรัม",
                    isPackage: ing.isPackage || false
                };
            });
            if (lastAdded.sellingPrice) state.customPrice = parseFloat(lastAdded.sellingPrice);

            const rInput = document.getElementById('recipeName');
            if (rInput) rInput.value = state.recipeName;
            const cInput = document.getElementById('customSellingPrice');
            if (cInput) cInput.value = state.customPrice;

            localStorage.setItem('brewcost_current_recipe_name', state.recipeName);
            localStorage.setItem('brewcost_current_custom_price', state.customPrice.toString());
            localStorage.setItem('brewcost_current_ingredients', JSON.stringify(state.ingredients));

            alert(`นำเข้าสูตรเรียบร้อยแล้วจำนวน ${addedCount} รายการ!`);
            switchTab('tab-recipe-cards');
            renderAll();
        } else {
            alert('ไม่พบข้อมูลสูตรที่ถูกต้องในไฟล์ JSON');
        }
    }

    function parseAndImportCSV(csvText) {
        const lines = csvText.split(/\r?\n/).filter(line => line.trim() !== '');
        if (lines.length <= 1) {
            alert('ไฟล์ CSV ไม่มีข้อมูล');
            return;
        }

        const recipesMap = {};
        for (let i = 1; i < lines.length; i++) {
            const cols = lines[i].split(',').map(c => c.trim().replace(/^"|"$/g, ''));
            if (cols.length < 7) continue;

            const rName = cols[0] || "สูตรที่นำเข้า";
            const sPrice = parseFloat(cols[1]) || 60;
            const ingName = cols[2] || "วัตถุดิบ";
            const price = parseFloat(cols[3]) || 0;
            const packQty = parseFloat(cols[4]) || 1;
            const packUnit = cols[5] || "กรัม";
            const useQty = parseFloat(cols[6]) || 0;
            const useUnit = cols[7] || packUnit;

            if (!recipesMap[rName]) {
                recipesMap[rName] = {
                    name: rName,
                    sellingPrice: sPrice,
                    ingredients: []
                };
            }

            recipesMap[rName].ingredients.push({
                name: ingName,
                price: price,
                packQty: packQty,
                packUnit: packUnit,
                useQty: useQty,
                useUnit: useUnit
            });
        }

        const recipeList = Object.values(recipesMap);
        if (recipeList.length > 0) {
            parseAndImportJSON(JSON.stringify(recipeList));
        } else {
            alert('ไม่สามารถอ่านข้อมูลสูตรจากไฟล์ CSV ได้');
        }
    }

    document.getElementById('btnExportSavedJSON')?.addEventListener('click', () => {
        if (!Array.isArray(state.savedRecipes) || state.savedRecipes.length === 0) {
            alert('ไม่มีข้อมูลสูตรในคลัง กรุณาบันทึกสูตรหรืออัปโหลดสูตรก่อน');
            return;
        }
        const jsonStr = JSON.stringify(state.savedRecipes, null, 2);
        downloadFile(jsonStr, 'coffee_recipes_export.json', 'application/json');
    });

    document.getElementById('btnDownloadCSVTemplate')?.addEventListener('click', () => {
        const csvContentWithBOM = '\uFEFF' + CSV_TEMPLATE_CONTENT;
        downloadFile(csvContentWithBOM, 'recipe_template.csv', 'text/csv;charset=utf-8;');
    });

    document.getElementById('btnDownloadJSONTemplate')?.addEventListener('click', () => {
        downloadFile(JSON_TEMPLATE_CONTENT, 'recipe_template.json', 'application/json');
    });

    function downloadFile(content, fileName, contentType) {
        const blob = new Blob([content], { type: contentType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // --- Global Exposed Event Handler Functions ---

    window.updateIngredient = (index, field, value) => {
        if (field === 'price' || field === 'packQty' || field === 'useQty') {
            state.ingredients[index][field] = parseFloat(value) || 0;
        } else {
            state.ingredients[index][field] = value;
        }
        localStorage.setItem('brewcost_current_ingredients', JSON.stringify(state.ingredients));
        renderAll();
    };

    window.removeIngredient = (index) => {
        state.ingredients.splice(index, 1);
        localStorage.setItem('brewcost_current_ingredients', JSON.stringify(state.ingredients));
        renderAll();
    };

    window.updateOverhead = (index, field, value) => {
        if (field === 'amount') {
            state.overheads[index][field] = parseFloat(value) || 0;
        } else {
            state.overheads[index][field] = value;
        }
        localStorage.setItem('brewcost_overheads', JSON.stringify(state.overheads));
        renderAll();
    };

    window.removeOverhead = (index) => {
        state.overheads.splice(index, 1);
        localStorage.setItem('brewcost_overheads', JSON.stringify(state.overheads));
        renderAll();
    };

    window.updateInvestment = (index, field, value) => {
        if (field === 'amount') {
            state.investments[index][field] = parseFloat(value) || 0;
        } else {
            state.investments[index][field] = value;
        }
        localStorage.setItem('brewcost_investments', JSON.stringify(state.investments));
        renderAll();
    };

    window.removeInvestment = (index) => {
        state.investments.splice(index, 1);
        localStorage.setItem('brewcost_investments', JSON.stringify(state.investments));
        renderAll();
    };

    window.loadSavedRecipe = (index) => {
        const recipe = state.savedRecipes[index];
        if (!recipe) return;
        state.recipeName = recipe.name;

        // Clone ingredients and match missing price/packQty from master catalog if needed
        state.ingredients = (recipe.ingredients || []).map(ing => {
            let price = ing.price;
            let packQty = ing.packQty;
            let packUnit = ing.packUnit;

            if (price === undefined || packQty === undefined || packUnit === undefined) {
                const masterMatch = state.masterIngredients.find(m => m.name === ing.name || ing.name.includes(m.name) || m.name.includes(ing.name));
                if (masterMatch) {
                    price = price !== undefined ? price : masterMatch.price;
                    packQty = packQty !== undefined ? packQty : masterMatch.packQty;
                    packUnit = packUnit !== undefined ? packUnit : masterMatch.packUnit;
                }
            }

            return {
                id: Date.now() + Math.random(),
                name: ing.name,
                price: price !== undefined ? price : 0,
                packQty: packQty !== undefined ? packQty : 1,
                packUnit: packUnit !== undefined ? packUnit : (ing.useUnit || 'กรัม'),
                useQty: ing.useQty !== undefined ? ing.useQty : 1,
                useUnit: ing.useUnit || 'กรัม',
                isPackage: ing.isPackage || false
            };
        });

        state.customPrice = recipe.sellingPrice || 60;

        localStorage.setItem('brewcost_current_recipe_name', state.recipeName);
        localStorage.setItem('brewcost_current_custom_price', state.customPrice.toString());
        localStorage.setItem('brewcost_current_ingredients', JSON.stringify(state.ingredients));

        const rInput = document.getElementById('recipeName');
        if (rInput) rInput.value = state.recipeName;
        const cInput = document.getElementById('customSellingPrice');
        if (cInput) cInput.value = state.customPrice;

        switchTab('tab-recipe');
    };

    window.deleteSavedRecipe = (index) => {
        state.savedRecipes.splice(index, 1);
        localStorage.setItem('brewcost_saved_recipes', JSON.stringify(state.savedRecipes));
        renderAll();
    };

    function switchTab(tabId) {
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

        const targetBtn = document.querySelector(`[data-tab="${tabId}"]`);
        const targetContent = document.getElementById(tabId);
        if (targetBtn && targetContent) {
            targetBtn.classList.add('active');
            targetContent.classList.add('active');
        }

        // Re-render after switching tab so canvas dimensions are active
        setTimeout(() => {
            renderAll();
        }, 50);
    }

    // --- Event Listeners Setup ---

    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const tabId = e.currentTarget.dataset.tab;
            switchTab(tabId);
        });
    });

    document.getElementById('recipeName')?.addEventListener('input', (e) => {
        state.recipeName = e.target.value;
        localStorage.setItem('brewcost_current_recipe_name', state.recipeName);
    });

    document.getElementById('wastageSlider')?.addEventListener('input', (e) => {
        state.wastagePercent = parseFloat(e.target.value) || 0;
        const input = document.getElementById('wastagePercent');
        if (input) input.value = state.wastagePercent;
        renderAll();
    });

    document.getElementById('wastagePercent')?.addEventListener('input', (e) => {
        state.wastagePercent = parseFloat(e.target.value) || 0;
        const slider = document.getElementById('wastageSlider');
        if (slider) slider.value = state.wastagePercent;
        renderAll();
    });

    document.getElementById('foodCostSlider')?.addEventListener('input', (e) => {
        state.targetFoodCost = parseFloat(e.target.value) || 30;
        const input = document.getElementById('targetFoodCost');
        if (input) input.value = state.targetFoodCost;
        renderAll();
    });

    document.getElementById('targetFoodCost')?.addEventListener('input', (e) => {
        state.targetFoodCost = parseFloat(e.target.value) || 30;
        const slider = document.getElementById('foodCostSlider');
        if (slider) slider.value = state.targetFoodCost;
        renderAll();
    });

    document.getElementById('customSellingPrice')?.addEventListener('input', (e) => {
        state.customPrice = parseFloat(e.target.value) || 0;
        localStorage.setItem('brewcost_current_custom_price', state.customPrice.toString());
        renderAll();
    });

    document.getElementById('deliveryGpPercent')?.addEventListener('input', (e) => {
        state.deliveryGpPercent = parseFloat(e.target.value) || 0;
        renderAll();
    });

    document.getElementById('vatIncluded')?.addEventListener('change', (e) => {
        state.vatIncluded = e.target.value;
        renderAll();
    });

    document.getElementById('eqYears')?.addEventListener('input', (e) => {
        state.equipmentYears = parseFloat(e.target.value) || 1;
        renderAll();
    });

    document.getElementById('calcAvgPrice')?.addEventListener('input', () => {
        state.manualOverrideAvg = true;
        renderAll();
    });
    document.getElementById('calcAvgCogs')?.addEventListener('input', () => {
        state.manualOverrideAvg = true;
        renderAll();
    });

    document.getElementById('targetMonthlyProfit')?.addEventListener('input', (e) => {
        state.targetProfit = parseFloat(e.target.value) || 0;
        renderAll();
    });

    document.getElementById('btnAddIngredient')?.addEventListener('click', () => {
        state.ingredients.push({
            id: Date.now(),
            name: "วัตถุดิบใหม่",
            price: 100,
            packQty: 1000,
            packUnit: "กรัม",
            useQty: 10,
            useUnit: "กรัม",
            isPackage: false
        });
        localStorage.setItem('brewcost_current_ingredients', JSON.stringify(state.ingredients));
        renderAll();
    });

    document.getElementById('btnAddPackage')?.addEventListener('click', () => {
        state.ingredients.push({
            id: Date.now(),
            name: "ฝา/สติ๊กเกอร์/ถุง",
            price: 150,
            packQty: 100,
            packUnit: "ชิ้น",
            useQty: 1,
            useUnit: "ชิ้น",
            isPackage: true
        });
        localStorage.setItem('brewcost_current_ingredients', JSON.stringify(state.ingredients));
        renderAll();
    });

    document.getElementById('btnAddOverhead')?.addEventListener('click', () => {
        state.overheads.push({
            id: Date.now(),
            name: "ค่าใช้จ่ายใหม่",
            amount: 1000
        });
        localStorage.setItem('brewcost_overheads', JSON.stringify(state.overheads));
        renderAll();
    });

    document.getElementById('btnAddInvestmentItem')?.addEventListener('click', () => {
        state.investments.push({
            id: Date.now(),
            name: "อุปกรณ์ / ค่าตกแต่งใหม่",
            amount: 10000
        });
        localStorage.setItem('brewcost_investments', JSON.stringify(state.investments));
        renderAll();
    });

    document.getElementById('btnSaveCurrentRecipe')?.addEventListener('click', () => {
        const res = calculateTotals();
        const newRecipe = {
            id: Date.now(),
            name: state.recipeName,
            category: "กาแฟเอสเพรสโซ่",
            dose: "18.5 กรัม",
            yield: "36 มล.",
            shotTime: "26 วินาที",
            temp: "93°C",
            steps: [
                "ตวงวัตถุดิบตามสัดส่วนที่กำหนดในสูตร",
                "ผสมวัตถุดิบทั้งหมดให้เข้ากัน ใส่น้ำแข็งพร้อมเสิร์ฟ"
            ],
            ingredients: JSON.parse(JSON.stringify(state.ingredients)),
            cogs: res.totalCogs,
            sellingPrice: res.customSelling,
            grossProfit: res.grossProfit,
            foodCostPercent: res.actualFoodCostPercent,
            deliveryPrice: res.deliveryPrice,
            salesMix: 20
        };

        state.savedRecipes.push(newRecipe);
        localStorage.setItem('brewcost_saved_recipes', JSON.stringify(state.savedRecipes));
        alert(`บันทึกสูตร "${state.recipeName}" เข้าคลังเก็บสูตรเรียบร้อยแล้ว! สามารถดูการ์ดสูตรบาริสต้าได้ที่แท็บ 2`);
        renderAll();
    });

    document.getElementById('btnClearSavedMenus')?.addEventListener('click', () => {
        if (confirm('คุณต้องการล้างคลังสูตรที่บันทึกไว้ทั้งหมดหรือไม่?')) {
            state.savedRecipes = [];
            localStorage.setItem('brewcost_saved_recipes', JSON.stringify([]));
            renderAll();
        }
    });

    document.getElementById('btnExport')?.addEventListener('click', () => {
        generateWholeShopReport();
        window.print();
    });

    // --- Inflation & Profit Sensitivity Simulator Functions ---
    const inflationSlider = document.getElementById('inflationSlider');
    const priceAdjustSlider = document.getElementById('priceAdjustSlider');

    inflationSlider?.addEventListener('input', (e) => {
        state.inflationPercent = parseInt(e.target.value) || 0;
        renderInflationSimulator();
    });

    priceAdjustSlider?.addEventListener('input', (e) => {
        state.priceAdjust = parseFloat(e.target.value) || 0;
        renderInflationSimulator();
    });

    function renderInflationSimulator() {
        const infPercent = state.inflationPercent || 0;
        const prAdjust = state.priceAdjust || 0;

        const infBadge = document.getElementById('inflationPercentBadge');
        if (infBadge) infBadge.textContent = `${infPercent >= 0 ? '+' : ''}${infPercent}%`;

        const prBadge = document.getElementById('priceAdjustBadge');
        if (prBadge) prBadge.textContent = `${prAdjust >= 0 ? '+' : ''}฿${prAdjust} / แก้ว`;

        const res = calculateTotals();
        const baseCogs = res.avgCogs > 0 ? res.avgCogs : 19.5;
        const basePrice = res.avgPrice > 0 ? res.avgPrice : 60;
        const beCupsMonth = res.beCupsMonth || 1000;
        const targetCupsMonth = res.targetCupsMonth || 1500;

        const newCogs = baseCogs * (1 + infPercent / 100);
        const newPrice = basePrice + prAdjust;
        const newMargin = newPrice - newCogs;

        const opDays = state.operatingDays || 30;
        const totalCupsEstimated = targetCupsMonth > 0 ? targetCupsMonth : beCupsMonth;
        const extraCostMonth = (newCogs - baseCogs) * totalCupsEstimated;

        const totalFixed = res.totalFixedOverhead;
        const newNetProfitMonth = (newMargin * totalCupsEstimated) - totalFixed;

        let newTargetCupsMonth = 0;
        if (newMargin > 0) {
            newTargetCupsMonth = Math.ceil((totalFixed + (state.targetProfit || 30000)) / newMargin);
        }
        const newTargetCupsDay = Math.ceil(newTargetCupsMonth / opDays);

        const simCost = document.getElementById('simExtraCostMonth');
        if (simCost) {
            simCost.textContent = `${extraCostMonth >= 0 ? '+' : ''}฿${extraCostMonth.toLocaleString('th-TH', {minimumFractionDigits:2, maximumFractionDigits:2})} / เดือน`;
        }

        const simProfit = document.getElementById('simNewNetProfitMonth');
        if (simProfit) {
            simProfit.textContent = `฿${newNetProfitMonth.toLocaleString('th-TH', {minimumFractionDigits:2, maximumFractionDigits:2})} / เดือน`;
            simProfit.style.color = newNetProfitMonth >= (state.targetProfit || 30000) ? '#16a34a' : (newNetProfitMonth > 0 ? '#d97706' : '#dc2626');
        }

        const simCups = document.getElementById('simNewTargetCupsDay');
        if (simCups) {
            simCups.textContent = `${newTargetCupsDay} แก้ว / วัน`;
        }
    }

    // --- Supplier Price Comparison Logic ---
    const supplierCompareModal = document.getElementById('supplierCompareModal');
    const btnOpenSupplierCompareModal = document.getElementById('btnOpenSupplierCompareModal');
    const btnCloseSupplierCompareModal = document.getElementById('btnCloseSupplierCompareModal');
    const supplierCompareItemSelect = document.getElementById('supplierCompareItemSelect');

    btnOpenSupplierCompareModal?.addEventListener('click', () => {
        populateSupplierItemSelect();
        supplierCompareModal.classList.add('active');
        updateSupplierComparisonCards();
    });

    btnCloseSupplierCompareModal?.addEventListener('click', () => {
        supplierCompareModal.classList.remove('active');
    });

    function populateSupplierItemSelect() {
        if (!supplierCompareItemSelect) return;
        supplierCompareItemSelect.innerHTML = '';
        state.masterIngredients.forEach((item, idx) => {
            const opt = document.createElement('option');
            opt.value = idx;
            opt.textContent = `${item.name} (ปัจจุบัน ฿${item.price}/${item.packQty}${item.packUnit})`;
            supplierCompareItemSelect.appendChild(opt);
        });
    }

    supplierCompareItemSelect?.addEventListener('change', () => {
        updateSupplierComparisonCards();
    });

    document.getElementById('suppBPrice')?.addEventListener('input', () => updateSupplierComparisonCards());
    document.getElementById('suppCPrice')?.addEventListener('input', () => updateSupplierComparisonCards());

    function updateSupplierComparisonCards() {
        if (!supplierCompareItemSelect || !state.masterIngredients.length) return;
        const index = parseInt(supplierCompareItemSelect.value);
        const item = state.masterIngredients[index];
        if (!item) return;

        const pA = parseFloat(item.price) || 0;
        const q = parseFloat(item.packQty) || 1;
        const unitA = pA / q;

        const suppAPriceEl = document.getElementById('suppAPrice');
        if (suppAPriceEl) suppAPriceEl.value = pA;
        const suppAUnitEl = document.getElementById('suppAUnitCost');
        if (suppAUnitEl) suppAUnitEl.textContent = `฿${unitA.toFixed(4)} / ${item.packUnit}`;

        const pB = parseFloat(document.getElementById('suppBPrice').value) || 0;
        const unitB = pB > 0 ? pB / q : 0;
        const suppBUnitEl = document.getElementById('suppBUnitCost');
        if (suppBUnitEl) suppBUnitEl.textContent = pB > 0 ? `฿${unitB.toFixed(4)} / ${item.packUnit}` : '฿0.00';

        const pC = parseFloat(document.getElementById('suppCPrice').value) || 0;
        const unitC = pC > 0 ? pC / q : 0;
        const suppCUnitEl = document.getElementById('suppCUnitCost');
        if (suppCUnitEl) suppCUnitEl.textContent = pC > 0 ? `฿${unitC.toFixed(4)} / ${item.packUnit}` : '฿0.00';

        const res = calculateTotals();
        const estCupsMonth = res.targetCupsMonth > 0 ? res.targetCupsMonth : 1500;
        
        let bestPrice = pA;
        let bestLabel = 'ซัพพลายเออร์ A (ปัจจุบัน)';

        if (pB > 0 && pB < bestPrice) {
            bestPrice = pB;
            bestLabel = 'เจ้า B';
        }
        if (pC > 0 && pC < bestPrice) {
            bestPrice = pC;
            bestLabel = 'เจ้า C';
        }

        const unitDiff = (pA - bestPrice) / q;
        const monthlySavings = unitDiff * (estCupsMonth * 15);

        const desc = document.getElementById('supplierSavingDescription');
        const amt = document.getElementById('supplierSavingsAmount');

        if (monthlySavings > 0) {
            if (desc) desc.textContent = `หากสลับไปใช้ ${bestLabel} จะช่วยประหยัดต้นทุนคลังวัตถุดิบได้ทันที:`;
            if (amt) {
                amt.textContent = `+฿${monthlySavings.toLocaleString('th-TH', {minimumFractionDigits:2, maximumFractionDigits:2})} / เดือน`;
                amt.style.color = '#16a34a';
            }
        } else if (monthlySavings < 0) {
            if (desc) desc.textContent = `ราคาใหม่สูงกว่าปัจจุบัน ทำให้ต้นทุนเพิ่มขึ้น:`;
            if (amt) {
                amt.textContent = `-฿${Math.abs(monthlySavings).toLocaleString('th-TH', {minimumFractionDigits:2, maximumFractionDigits:2})} / เดือน`;
                amt.style.color = '#dc2626';
            }
        } else {
            if (desc) desc.textContent = `กรอกราคาเสนอซื้อจากเจ้า B หรือ C เพื่อเปรียบเทียบผลต่างเงินประหยัดรายเดือน`;
            if (amt) {
                amt.textContent = `฿0.00 / เดือน`;
                amt.style.color = '#16a34a';
            }
        }
    }

    document.getElementById('btnSwapToSuppB')?.addEventListener('click', () => {
        const index = parseInt(supplierCompareItemSelect.value);
        const pB = parseFloat(document.getElementById('suppBPrice').value);
        if (isNaN(pB) || pB <= 0) {
            alert('กรุณากรอกราคาเสนอซื้อของเจ้า B');
            return;
        }
        state.masterIngredients[index].price = pB;
        safeStorageSet('brewcost_master_stock', JSON.stringify(state.masterIngredients));
        supplierCompareModal.classList.remove('active');
        renderAll();
        alert(`⚡️ สลับมาใช้ราคาเจ้า B (฿${pB}) สำหรับ "${state.masterIngredients[index].name}" เรียบร้อยแล้ว!`);
    });

    document.getElementById('btnSwapToSuppC')?.addEventListener('click', () => {
        const index = parseInt(supplierCompareItemSelect.value);
        const pC = parseFloat(document.getElementById('suppCPrice').value);
        if (isNaN(pC) || pC <= 0) {
            alert('กรุณากรอกราคาเสนอซื้อของเจ้า C');
            return;
        }
        state.masterIngredients[index].price = pC;
        safeStorageSet('brewcost_master_stock', JSON.stringify(state.masterIngredients));
        supplierCompareModal.classList.remove('active');
        renderAll();
        alert(`⚡️ สลับมาใช้ราคาเจ้า C (฿${pC}) สำหรับ "${state.masterIngredients[index].name}" เรียบร้อยแล้ว!`);
    });

    // --- House Blend Scaler Functions ---
    const blendModal = document.getElementById('blendCalculatorModal');
    const btnOpenBlendModal = document.getElementById('btnOpenBlendModal');
    const btnCloseBlendModal = document.getElementById('btnCloseBlendModal');

    btnOpenBlendModal?.addEventListener('click', () => {
        blendModal.classList.add('active');
        calculateBlendTotals();
    });

    btnCloseBlendModal?.addEventListener('click', () => {
        blendModal.classList.remove('active');
    });

    document.querySelectorAll('#blendRowsContainer .form-control').forEach(input => {
        input.addEventListener('input', () => calculateBlendTotals());
    });

    function calculateBlendTotals() {
        const rows = document.querySelectorAll('#blendRowsContainer .blend-row');
        let totalRatio = 0;
        let weightedPriceSum = 0;

        rows.forEach(row => {
            const price = parseFloat(row.querySelector('.blend-price').value) || 0;
            const ratio = parseFloat(row.querySelector('.blend-ratio').value) || 0;
            totalRatio += ratio;
            weightedPriceSum += (price * (ratio / 100));
        });

        const ratioSumEl = document.getElementById('blendRatioSum');
        if (ratioSumEl) {
            ratioSumEl.textContent = `${totalRatio}%`;
            ratioSumEl.style.color = totalRatio === 100 ? '#16a34a' : '#dc2626';
        }

        const avgPriceEl = document.getElementById('blendAvgPriceKg');
        if (avgPriceEl) {
            avgPriceEl.textContent = `฿${weightedPriceSum.toFixed(2)} / 500g`;
        }

        const costPerShotEl = document.getElementById('blendCostPerShot');
        if (costPerShotEl) {
            const costPerGram = weightedPriceSum / 500;
            const shotCost = costPerGram * 18.5; // Standard 18.5g espresso shot
            costPerShotEl.textContent = `฿${shotCost.toFixed(2)} / ช็อต (18.5g)`;
        }

        return { title: document.getElementById('blendRecipeTitle').value.trim(), price500g: weightedPriceSum };
    }

    document.getElementById('btnSaveBlendToMaster')?.addEventListener('click', () => {
        const res = calculateBlendTotals();
        if (!res.title) {
            alert('กรุณาระบุชื่อสูตรเบลนด์กาแฟ');
            return;
        }

        const existingIdx = state.masterIngredients.findIndex(m => m.name.toLowerCase().includes('blend') || m.name === res.title);
        if (existingIdx >= 0) {
            state.masterIngredients[existingIdx].name = res.title;
            state.masterIngredients[existingIdx].price = res.price500g;
        } else {
            state.masterIngredients.unshift({
                id: 'blend_' + Date.now(),
                name: res.title,
                price: res.price500g,
                packQty: 500,
                packUnit: 'กรัม'
            });
        }

        safeStorageSet('brewcost_master_stock', JSON.stringify(state.masterIngredients));
        blendModal.classList.remove('active');
        renderAll();
        alert(`⚡️ บันทึกสูตรเบลนด์ "${res.title}" (฿${res.price500g.toFixed(2)}/500g) เข้าคลังวัตถุดิบกลางเรียบร้อยแล้ว!`);
    });

    // --- Reorder Planner Functions ---
    document.getElementById('reorderPeriodSelect')?.addEventListener('change', () => {
        renderReorderPlanner();
    });

    function renderReorderPlanner() {
        const tbody = document.getElementById('reorderTableBody');
        if (!tbody) return;

        const periodDays = parseInt(document.getElementById('reorderPeriodSelect')?.value || '30');
        const res = calculateTotals();

        const estCupsDay = res.targetCupsDay > 0 ? res.targetCupsDay : (res.beCupsDay > 0 ? res.beCupsDay : 50);
        const totalPeriodCups = estCupsDay * periodDays;

        document.getElementById('reorderEstCupsTotal').textContent = `${totalPeriodCups.toLocaleString()} แก้ว`;
        document.getElementById('reorderEstCupsDay').textContent = `${estCupsDay}`;

        tbody.innerHTML = '';
        let totalReorderBudget = 0;

        state.masterIngredients.forEach(master => {
            let avgUseQty = master.packUnit === 'กรัม' ? 18.5 : (master.packUnit === 'มล.' ? 80 : 1);
            
            const matchingIng = state.ingredients.find(i => i.name.includes(master.name) || master.name.includes(i.name));
            if (matchingIng) {
                avgUseQty = matchingIng.useQty || avgUseQty;
            }

            const totalNeedQty = avgUseQty * totalPeriodCups;
            const packsNeeded = Math.ceil(totalNeedQty / (master.packQty || 1));
            const itemBudget = packsNeeded * (master.price || 0);

            totalReorderBudget += itemBudget;

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><strong>${master.name}</strong></td>
                <td>${totalNeedQty.toLocaleString('th-TH', {maximumFractionDigits: 1})} ${master.packUnit}</td>
                <td>${master.packQty} ${master.packUnit} (฿${master.price})</td>
                <td style="text-align:center;"><span class="badge badge-info" style="font-size:12px; font-weight:800;">${packsNeeded.toLocaleString()} แพ็ค</span></td>
                <td style="text-align:right; font-weight:700; color:#16a34a;">฿${itemBudget.toLocaleString('th-TH', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
            `;
            tbody.appendChild(tr);
        });

        document.getElementById('reorderTotalBudget').textContent = `฿${totalReorderBudget.toLocaleString('th-TH', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
    }

    // Initialize App
    renderAll();
});
