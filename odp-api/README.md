# วิธีการใช้งาน CASAN-BE-TEMPLATE
* 1. Install node package โดยใช้คำสั่ง 
```bash
npm i
```
* 2. สร้างไฟล์ .env และกำหนดค่าต่างๆ ตาม environment ของเรา
```bash
MONGODB_URI=mongodb+srv://tasan:bTTtsV8hG7MoFrecX@cluster0.to5oq9m.mongodb.net/odpDB?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=1cb81f51f7695d94696170a1f63162f9118175a37891c8e96d2f8b9009ece09a31937da595079bfdeea838d04d57e7030b7b8ba844cf299657a7f7eef1131f3b
```
* 3. ทดสอบ API ว่าสามารถทำงานได้หรือไม่ โดยใช้คำสั่ง 
```bash
npm run start:dev
```

# วิธีการใช้งาน Schemetic CLI สำหรับ NestJS
* 1. ติดตั้ง CASAN Schemetic CLI โดยใช้คำสั่ง 
```bash
npm i --save-dev casan-schematics
```
* 2. Generate NestJS module โดยใช้คำสั่ง 
```bash
schematics casan-schematics:nestjs-mongo-module --name=diagnose
```

