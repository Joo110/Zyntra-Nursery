# Phase 10 — Critical Backend Issues

> **لم يتم تعديل أي كود Backend.** هذه قائمة توثيقية فقط، لاستخدامها كمرجع تواصل مع فريق الـ Backend قبل/أثناء التنفيذ.

---

## 1. EvaluationsController — Route لا يحتوي `{branchId}`
- **المشكلة:** `[Route("api/[controller]")]` بدون `{branchId}` بالـ Template، بينما كل الـ Actions (`GetEvaluationInfoAsync`, `GetAverageEvaluationAsync`, ...) تستقبل `[FromRoute] Guid branchId` كباراميتر.
- **مكانها:** `Zyntra.School.API/Controllers/EvaluationsController.cs`
- **تأثيرها على الـ Frontend:** أي نداء لهذا الـ Controller (كل شاشة "تقييم اليوم" و"الفائزين") **سيفشل فعليًا بـ 404** لأن ASP.NET Routing لن يجد قيمة لـ `branchId` من المسار — لا يوجد Route Segment يحمل هذا الاسم.
- **هل تمنع التنفيذ؟** **نعم — تمنع Module التقييمات بالكامل** حتى يُصلَح.
- **الحل المقترح للـ Backend:** إما تغيير الـ Route إلى `[Route("api/branches/{branchId}/[controller]")]` (متوافق مع باقي الـ Controllers المشابهة)، أو تحويل `branchId` في كل Action من `[FromRoute]` إلى `[FromQuery]` إن كان القصد إبقاءه Route عام غير مرتبط بفرع بالمسار.

---

## 2. Enum Serialization (نص أم رقم؟) غير مؤكد
- **المشكلة:** لا يوجد `JsonStringEnumConverter` مُسجَّل صراحة في `Program.cs`. الافتراض الحالي لـ `System.Text.Json` بدونه هو تسلسل الـ Enums كأرقام صحيحة (Integer).
- **مكانها:** `Program.cs` (إعداد عام) — يؤثر على كل الـ Enums بكل الـ DTOs (`Period`, `Gender`, `MemberType`, `UserRole`, `TrunsactionType`, `TreasuryKind`, `SentVia`).
- **تأثيرها على الـ Frontend:** يحدد شكل الـ `types/enums.types.ts` بالكامل — هل نرسل/نستقبل `0` أم `"AM"` مثلًا لـ `Period.AM`. خطأ هنا يعني فشل كل Request/Response يحتوي Enum.
- **هل تمنع التنفيذ؟** لا تمنع التنفيذ بالكامل لكنها **تمنع البدء الآمن** في أي Module يحتوي Enum (أغلب الـ Modules) قبل التأكيد.
- **الحل المقترح:** تشغيل الـ API فعليًا (أو مراجعة استجابة حقيقية واحدة على الأقل، مثل `GET /api/Branch/dropdown` أو أي Endpoint يحتوي Enum) لتأكيد الشكل الفعلي بالـ Runtime قبل Phase 6 (Core Infrastructure)، دون انتظار تعديل من فريق الـ Backend بالضرورة — فقط تأكيد الحالة الحالية.

---

## 3. WorkerController — Route لا يحتوي `{branchId}` رغم استخدامه بكل الـ Actions
- **المشكلة:** نفس مشكلة #1 بالضبط. `[Route("api/[controller]")]` بدون `branchId`، لكن `GetWorkerListAsync`, `GetNumberOfWorkersAsync`, `AddWorkerAsync`, `UpdateWorkerAsync`, `DeleteWorkerAsync` كلها تستقبل `[FromRoute] Guid branchId`.
- **مكانها:** `Zyntra.School.API/Controllers/WorkerController.cs`
- **تأثيرها على الـ Frontend:** **Module العمال (Workers) بالكامل سيفشل بـ 404** لنفس السبب.
- **هل تمنع التنفيذ؟** **نعم — تمنع Module Workers بالكامل.**
- **الحل المقترح:** توحيد الـ Route مع باقي الوحدات المشابهة: `[Route("api/branches/{branchId}/[controller]")]`.

---

## 4. BrotherController — لا يحتوي `branchId` إطلاقًا (تصميم وليس Bug، لكن يحتاج توضيح)
- **المشكلة:** على عكس #1 و#3، هنا لا يوجد أي استخدام لـ `branchId` بالـ Controller — لا بالـ Route ولا بالـ Actions. الربط الوحيد هو عبر `ChildId`.
- **مكانها:** `Zyntra.School.API/Controllers/BrotherController.cs`
- **تأثيرها على الـ Frontend:** لا يوجد خطأ تقني هنا، لكن **يحتاج تأكيد تصميمي**: هل الإخوة (Brothers) يجب أن يكونوا مرتبطين بفرع (Branch) عبر الطفل صاحب العلاقة، أم أنهم فعليًا كيان مستقل عن مفهوم الفرع بالكامل؟ إن كان الأول، فقد تحتاج شاشة "قائمة كل الإخوة" (`GET /Brother/list`) لفلترة إضافية حسب فرع الطفل المرتبط، وهذا غير متاح حاليًا بالـ API.
- **هل تمنع التنفيذ؟** لا — Module يعمل تقنيًا، لكن القرار التصميمي يحتاج توضيح قبل بناء شاشة القائمة العامة.
- **الحل المقترح:** توضيح من الفريق: هل مطلوب فلترة `Brothers` حسب `branchId` (عبر الطفل)، أم يكفي `ChildId` كما هو حاليًا؟

---

## 5. Missing DashboardController
- **المشكلة:** `DashboardService` (يحسب `TreasuryStatisticsDto`: دخل/مصروفات/رصيد) مسجَّل في DI وموجود بالكود، لكن **لا يوجد Controller** يعرضه كـ API.
- **مكانها:** `Zyntra.School.logic/Services/DashboardService/DashboardService.cs` (بدون Controller مقابل)
- **تأثيرها على الـ Frontend:** لا يمكن بناء صفحة "لوحة تحكم" حقيقية بأرقام دقيقة لهذه المؤشرات المالية المحسوبة جاهزة من الـ Backend. يمكن تعويض جزء منها بتجميع بيانات من `Treasury` Endpoints الموجودة يدويًا، لكن ليس كل شيء (مثل `IsBalancePositive` المحسوب جاهزًا).
- **هل تمنع التنفيذ؟** لا تمنع بناء التطبيق ككل، لكن **تحدّ من جودة/دقة صفحة الـ Dashboard**.
- **الحل المقترح:** إضافة `DashboardController` بسيط يعرض `GET /api/Dashboard/treasury-statistics` (أو مسار مشابه) يستدعي `DashboardService.GetTreasuryStatisticsAsync()` الموجود بالفعل.

---

## 6. غياب Authentication/Authorization حقيقية
- **المشكلة:** تفصيل كامل بتقرير Phase 1 — لا JWT، لا Cookies، لا `[Authorize]` بأي مكان، رغم استدعاء `UseAuthentication()/UseAuthorization()` بدون Scheme فعلي مُسجَّل.
- **مكانها:** `Program.cs` (عام)، وكل الـ Controllers (غياب `[Authorize]`).
- **تأثيرها على الـ Frontend:** أي Route Protection بالفرونت هي UX فقط، بدون أي ضمان أمني حقيقي. أي مستخدم يعرف الـ API مباشرة يستطيع تنفيذ أي عملية (بما فيها Delete All) بدون تسجيل دخول إطلاقًا.
- **هل تمنع التنفيذ؟** لا تمنع تقنيًا (النظام سيعمل)، لكنها **قضية أمنية جوهرية تمنع أي استخدام Production حقيقي** حتى تُحل.
- **الحل المقترح:** إضافة JWT Bearer Authentication + `[Authorize]`/`[Authorize(Roles=...)]` على كل الـ Controllers الحساسة، وتعديل `POST /User/login` لإصدار Token فعلي بدل مجرد إعادة بيانات المستخدم.

---

## 7. Temp Password Request Body — نوع غير معتاد
- **المشكلة:** `POST /api/User/{userId}/temp-password` يستقبل `[FromBody] string tempPassword` — أي JSON string خام (`"newpass123"`) وليس Object (`{ tempPassword: "..." }`). هذا نمط أقل شيوعًا وقد يحتاج معاملة خاصة بالـ Axios (`JSON.stringify` مباشرة كـ body بدون تغليف Object).
- **مكانها:** `Zyntra.School.API/Controllers/UserController.cs`
- **تأثيرها على الـ Frontend:** يحتاج معالجة خاصة داخل `userService.ts` (إرسال Body كـ string مباشرة، والتأكد أن `Content-Type: application/json` لا يزال صحيحًا مع string خام).
- **هل تمنع التنفيذ؟** لا — قابل للتعامل معه، لكنه غير النمط المعتاد بباقي الـ API ويحتاج اختبارًا فعليًا مبكرًا للتأكد من نجاحه.
- **الحل المقترح (اختياري لتحسين الاتساق):** تحويله لـ DTO بسيط `{ tempPassword: string }` ليتوافق مع باقي الـ Endpoints، لكن هذا تغيير غير إلزامي تقنيًا.

---

## 8. Backup/Restore Database Endpoints — مخاطر تصميمية
- **المشكلة:** `POST /Setting/backup-database` و`POST /Setting/restore-database` يستقبلان `databasePath` و`backupPath` كـ Query Strings نصية خام من الـ Client، وينفذان عمليات على نظام ملفات السيرفر مباشرة. `backup-database` كذلك **Synchronous (غير async)** رغم كونه Endpoint بـ API قد يستغرق وقتًا طويلًا (قد يسبب حجب الـ Thread/Timeout بالمتصفح لملفات كبيرة).
- **مكانها:** `Zyntra.School.API/Controllers/SettingController.cs`
- **تأثيرها على الـ Frontend:** يبدو أنها ميزة موروثة من تطبيق الـ WinForms الأصلي (حيث المسارات محلية على نفس جهاز السيرفر منطقيًا)، وليست مصممة أصلًا لواجهة ويب حيث الـ Client بعيد عن السيرفر. إدخال المستخدم لمسار ملف يدويًا بواجهة الويب غير منطقي عمليًا (المستخدم لا يعرف نظام ملفات السيرفر).
- **هل تمنع التنفيذ؟** لا تمنع باقي التطبيق، لكن **يجب عدم بناء هذه الشاشة بشكل عادي** إلا بعد توضيح صريح من الفريق حول الغرض الفعلي منها في سياق الويب.
- **الحل المقترح:** توضيح من الفريق: هل هذه الميزة مطلوبة أصلًا بواجهة الويب؟ إن كانت نعم، يُفضَّل تحويلها لآلية Upload/Download حقيقية (Multipart) بدل مسارات نصية مباشرة على السيرفر.

---

## ملخص سريع — هل تمنع التنفيذ؟

| # | المشكلة | تمنع التنفيذ؟ |
|---|---|---|
| 1 | EvaluationsController Route | ✅ نعم — Module التقييمات معطّل بالكامل |
| 2 | Enum Serialization غير مؤكد | ⚠️ تمنع البدء الآمن قبل التأكيد (فحص سريع يحلها) |
| 3 | WorkerController Route | ✅ نعم — Module العمال معطّل بالكامل |
| 4 | BrotherController بدون branchId | ❌ لا — قرار تصميمي فقط |
| 5 | Missing DashboardController | ❌ لا — يحدّ من جودة صفحة Dashboard فقط |
| 6 | غياب Authentication حقيقية | ❌ لا تقنيًا / ✅ نعم أمنيًا لأي استخدام حقيقي |
| 7 | Temp Password raw string body | ❌ لا — يحتاج معالجة خاصة فقط |
| 8 | Backup/Restore endpoints | ❌ لا — لكن تحتاج توضيح قبل بناء شاشتها |

**أولوية طلب الإصلاح من فريق الـ Backend قبل بدء Phase Modules الفعلية:** #1 و #3 (يمنعان Modules كاملة)، ثم التأكد من #2 (فحص سريع بدون انتظار تعديل).
