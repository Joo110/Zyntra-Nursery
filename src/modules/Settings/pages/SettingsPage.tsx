import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { Settings as SettingsIcon, DatabaseBackup, DatabaseZap } from 'lucide-react';
import { useSettings, useUpdateSettings, useBackupDatabase, useRestoreDatabase } from '../hooks/useSettings';
import type { UpdateSettingDto } from '../types/setting.types';
import { Input } from '@/components/forms/Input';
import { Textarea } from '@/components/forms/Textarea';
import { FormField } from '@/components/forms/FormField';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { RoleGuard } from '@/app/guards/RoleGuard';
import { UserRole } from '@/types/enums.types';
import { PageLoader } from '@/components/loading/PageLoader';

type FormValues = Omit<UpdateSettingDto, 'id'>;

/** "HH:mm:ss" القادم من الباك -> "HH:mm" اللي بيقبله input[type=time] */
const toTimeInput = (v?: string | null) => (v ? v.slice(0, 5) : '');
/** "HH:mm" من input -> "HH:mm:ss" عشان يتوافق مع TimeOnly بالباك */
const toTimeApi = (v?: string | null) => (v ? `${v}:00` : null);

const defaultValues: FormValues = {
  timeEnter: '', timeEnterPm: '', lasttimeEnter: '', lasttimeEnterPm: '',
  timeLeave: '', timeLeavePm: '', lasttimeLeave: '', lasttimeLeavePm: '',
  timeLateForKids: '', timeLateForKidsPm: '',
  timeEnterForTeacher: '', timeEnterForTeacherPm: '', timeLateForTeachers: '', timeLateForTeachersPm: '',
  timeEnterForWorker: '', timeEnterForWorkerPm: '', timeLateForWorkers: '', timeLateForWorkersPm: '',
  daysLateToPay: 0, daysKindsAbsence: 0, kidsBratherAge: 0, kidsBratherAge2: '',
  notefayKidsLate: 0, lateDiscount: 0, absenceLate: 0, dayOfStaudyInMonth: 0,
  vication1: 0, vication2: 0, isPayInBegning: false,
  teacherSalary: 0, workerSalary: 0, childSubscriptionAmount: 0,
  orgName: '', managerName: '', logoPath: '', packupPath: '', orgEmail: '',
  smallPaper: false, askBeforPrint: true, showBeforPrint: true,
  smsNumber: '', smsNumberAPIKey: '', whatsAppNumber: '', whatsAppNumberAPIKey: '',
  subMessage: '', absenceMessage: '', brothersAgeMessage: '', birthDayMessage: '', empAge: '',
};

export function SettingsPage() {
  const { data, isLoading } = useSettings();
  const updateSettings = useUpdateSettings();
  const backupDatabase = useBackupDatabase();
  const restoreDatabase = useRestoreDatabase();

  const [backupName, setBackupName] = useState('');
  const [restoreFileName, setRestoreFileName] = useState('');

  const { register, handleSubmit, reset } = useForm<FormValues>({ defaultValues });

  useEffect(() => {
    if (!data) return;
    reset({
      timeEnter: toTimeInput(data.timeEnter), timeEnterPm: toTimeInput(data.timeEnterPm),
      lasttimeEnter: toTimeInput(data.lasttimeEnter), lasttimeEnterPm: toTimeInput(data.lasttimeEnterPm),
      timeLeave: toTimeInput(data.timeLeave), timeLeavePm: toTimeInput(data.timeLeavePm),
      lasttimeLeave: toTimeInput(data.lasttimeLeave), lasttimeLeavePm: toTimeInput(data.lasttimeLeavePm),
      timeLateForKids: toTimeInput(data.timeLateForKids), timeLateForKidsPm: toTimeInput(data.timeLateForKidsPm),
      timeEnterForTeacher: toTimeInput(data.timeEnterForTeacher), timeEnterForTeacherPm: toTimeInput(data.timeEnterForTeacherPm),
      timeLateForTeachers: toTimeInput(data.timeLateForTeachers), timeLateForTeachersPm: toTimeInput(data.timeLateForTeachersPm),
      timeEnterForWorker: toTimeInput(data.timeEnterForWorker), timeEnterForWorkerPm: toTimeInput(data.timeEnterForWorkerPm),
      timeLateForWorkers: toTimeInput(data.timeLateForWorkers), timeLateForWorkersPm: toTimeInput(data.timeLateForWorkersPm),
      daysLateToPay: data.daysLateToPay, daysKindsAbsence: data.daysKindsAbsence,
      kidsBratherAge: data.kidsBratherAge, kidsBratherAge2: data.kidsBratherAge2 ?? '',
      notefayKidsLate: data.notefayKidsLate, lateDiscount: data.lateDiscount, absenceLate: data.absenceLate,
      dayOfStaudyInMonth: data.dayOfStaudyInMonth, vication1: data.vication1, vication2: data.vication2,
      isPayInBegning: data.isPayInBegning,
      teacherSalary: data.teacherSalary, workerSalary: data.workerSalary, childSubscriptionAmount: data.childSubscriptionAmount,
      orgName: data.orgName ?? '', managerName: data.managerName ?? '', logoPath: data.logoPath ?? '',
      packupPath: data.packupPath ?? '', orgEmail: data.orgEmail ?? '',
      smallPaper: data.smallPaper, askBeforPrint: data.askBeforPrint, showBeforPrint: data.showBeforPrint,
      smsNumber: data.smsNumber ?? '', smsNumberAPIKey: data.smsNumberAPIKey ?? '',
      whatsAppNumber: data.whatsAppNumber ?? '', whatsAppNumberAPIKey: data.whatsAppNumberAPIKey ?? '',
      subMessage: data.subMessage ?? '', absenceMessage: data.absenceMessage ?? '',
      brothersAgeMessage: data.brothersAgeMessage ?? '', birthDayMessage: data.birthDayMessage ?? '',
      empAge: data.empAge ?? '',
    });
  }, [data, reset]);

  const onSubmit = (values: FormValues) => {
    if (!data) return;
    updateSettings.mutate({
      id: data.id,
      ...values,
      timeEnter: toTimeApi(values.timeEnter), timeEnterPm: toTimeApi(values.timeEnterPm),
      lasttimeEnter: toTimeApi(values.lasttimeEnter), lasttimeEnterPm: toTimeApi(values.lasttimeEnterPm),
      timeLeave: toTimeApi(values.timeLeave), timeLeavePm: toTimeApi(values.timeLeavePm),
      lasttimeLeave: toTimeApi(values.lasttimeLeave), lasttimeLeavePm: toTimeApi(values.lasttimeLeavePm),
      timeLateForKids: toTimeApi(values.timeLateForKids), timeLateForKidsPm: toTimeApi(values.timeLateForKidsPm),
      timeEnterForTeacher: toTimeApi(values.timeEnterForTeacher), timeEnterForTeacherPm: toTimeApi(values.timeEnterForTeacherPm),
      timeLateForTeachers: toTimeApi(values.timeLateForTeachers), timeLateForTeachersPm: toTimeApi(values.timeLateForTeachersPm),
      timeEnterForWorker: toTimeApi(values.timeEnterForWorker), timeEnterForWorkerPm: toTimeApi(values.timeEnterForWorkerPm),
      timeLateForWorkers: toTimeApi(values.timeLateForWorkers), timeLateForWorkersPm: toTimeApi(values.timeLateForWorkersPm),
    });
  };

  return (
    <RoleGuard allow={[UserRole.Admin]} fallback={<p className="text-sm text-neutral-500">ليس لديك صلاحية للوصول لهذه الصفحة.</p>}>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="flex items-center gap-2 text-xl font-bold text-neutral-900"><SettingsIcon className="h-5 w-5" /> الإعدادات</h1>
          <p className="text-sm text-neutral-500">إعدادات النظام العامة</p>
        </div>

        {isLoading ? (
          <PageLoader />
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
            {/* بيانات المنشأة */}
            <Card className="p-6">
              <h2 className="mb-4 text-sm font-semibold text-neutral-700">بيانات المنشأة</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField label="اسم المنشأة" htmlFor="orgName">
                  <Input id="orgName" {...register('orgName')} />
                </FormField>
                <FormField label="اسم المدير" htmlFor="managerName">
                  <Input id="managerName" {...register('managerName')} />
                </FormField>
                <FormField label="البريد الإلكتروني للمنشأة" htmlFor="orgEmail">
                  <Input id="orgEmail" type="email" className="ltr-numerals" {...register('orgEmail')} />
                </FormField>
                <FormField label="مسار الشعار (Logo Path)" htmlFor="logoPath">
                  <Input id="logoPath" {...register('logoPath')} />
                </FormField>
              </div>
            </Card>

            {/* مواعيد الأطفال */}
            <Card className="p-6">
              <h2 className="mb-4 text-sm font-semibold text-neutral-700">مواعيد حضور وانصراف الأطفال</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <FormField label="موعد الحضور (صباحي)" htmlFor="timeEnter">
                  <Input id="timeEnter" type="time" className="ltr-numerals" {...register('timeEnter')} />
                </FormField>
                <FormField label="موعد الحضور (مسائي)" htmlFor="timeEnterPm">
                  <Input id="timeEnterPm" type="time" className="ltr-numerals" {...register('timeEnterPm')} />
                </FormField>
                <FormField label="آخر موعد حضور (صباحي)" htmlFor="lasttimeEnter">
                  <Input id="lasttimeEnter" type="time" className="ltr-numerals" {...register('lasttimeEnter')} />
                </FormField>
                <FormField label="آخر موعد حضور (مسائي)" htmlFor="lasttimeEnterPm">
                  <Input id="lasttimeEnterPm" type="time" className="ltr-numerals" {...register('lasttimeEnterPm')} />
                </FormField>
                <FormField label="موعد الانصراف (صباحي)" htmlFor="timeLeave">
                  <Input id="timeLeave" type="time" className="ltr-numerals" {...register('timeLeave')} />
                </FormField>
                <FormField label="موعد الانصراف (مسائي)" htmlFor="timeLeavePm">
                  <Input id="timeLeavePm" type="time" className="ltr-numerals" {...register('timeLeavePm')} />
                </FormField>
                <FormField label="آخر موعد انصراف (صباحي)" htmlFor="lasttimeLeave">
                  <Input id="lasttimeLeave" type="time" className="ltr-numerals" {...register('lasttimeLeave')} />
                </FormField>
                <FormField label="آخر موعد انصراف (مسائي)" htmlFor="lasttimeLeavePm">
                  <Input id="lasttimeLeavePm" type="time" className="ltr-numerals" {...register('lasttimeLeavePm')} />
                </FormField>
                <FormField label="موعد اعتبار الطفل متأخر (صباحي)" htmlFor="timeLateForKids">
                  <Input id="timeLateForKids" type="time" className="ltr-numerals" {...register('timeLateForKids')} />
                </FormField>
                <FormField label="موعد اعتبار الطفل متأخر (مسائي)" htmlFor="timeLateForKidsPm">
                  <Input id="timeLateForKidsPm" type="time" className="ltr-numerals" {...register('timeLateForKidsPm')} />
                </FormField>
              </div>
            </Card>

            {/* مواعيد المعلمين */}
            <Card className="p-6">
              <h2 className="mb-4 text-sm font-semibold text-neutral-700">مواعيد المعلمين</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <FormField label="موعد الحضور (صباحي)" htmlFor="timeEnterForTeacher">
                  <Input id="timeEnterForTeacher" type="time" className="ltr-numerals" {...register('timeEnterForTeacher')} />
                </FormField>
                <FormField label="موعد الحضور (مسائي)" htmlFor="timeEnterForTeacherPm">
                  <Input id="timeEnterForTeacherPm" type="time" className="ltr-numerals" {...register('timeEnterForTeacherPm')} />
                </FormField>
                <FormField label="موعد اعتبار المعلم متأخر (صباحي)" htmlFor="timeLateForTeachers">
                  <Input id="timeLateForTeachers" type="time" className="ltr-numerals" {...register('timeLateForTeachers')} />
                </FormField>
                <FormField label="موعد اعتبار المعلم متأخر (مسائي)" htmlFor="timeLateForTeachersPm">
                  <Input id="timeLateForTeachersPm" type="time" className="ltr-numerals" {...register('timeLateForTeachersPm')} />
                </FormField>
              </div>
            </Card>

            {/* مواعيد العمال */}
            <Card className="p-6">
              <h2 className="mb-4 text-sm font-semibold text-neutral-700">مواعيد العمال</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <FormField label="موعد الحضور (صباحي)" htmlFor="timeEnterForWorker">
                  <Input id="timeEnterForWorker" type="time" className="ltr-numerals" {...register('timeEnterForWorker')} />
                </FormField>
                <FormField label="موعد الحضور (مسائي)" htmlFor="timeEnterForWorkerPm">
                  <Input id="timeEnterForWorkerPm" type="time" className="ltr-numerals" {...register('timeEnterForWorkerPm')} />
                </FormField>
                <FormField label="موعد اعتبار العامل متأخر (صباحي)" htmlFor="timeLateForWorkers">
                  <Input id="timeLateForWorkers" type="time" className="ltr-numerals" {...register('timeLateForWorkers')} />
                </FormField>
                <FormField label="موعد اعتبار العامل متأخر (مسائي)" htmlFor="timeLateForWorkersPm">
                  <Input id="timeLateForWorkersPm" type="time" className="ltr-numerals" {...register('timeLateForWorkersPm')} />
                </FormField>
              </div>
            </Card>

            {/* القواعد المالية وقواعد الحضور */}
            <Card className="p-6">
              <h2 className="mb-4 text-sm font-semibold text-neutral-700">القواعد المالية وقواعد الحضور</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <FormField label="أيام التأخير قبل السداد" htmlFor="daysLateToPay">
                  <Input id="daysLateToPay" type="number" className="ltr-numerals" {...register('daysLateToPay')} />
                </FormField>
                <FormField label="أيام غياب الأطفال المسموحة" htmlFor="daysKindsAbsence">
                  <Input id="daysKindsAbsence" type="number" className="ltr-numerals" {...register('daysKindsAbsence')} />
                </FormField>
                <FormField label="سن الإخوة (بالسنين)" htmlFor="kidsBratherAge">
                  <Input id="kidsBratherAge" type="number" className="ltr-numerals" {...register('kidsBratherAge')} />
                </FormField>
                <FormField label="ملاحظة سن الإخوة (نص إضافي)" htmlFor="kidsBratherAge2">
                  <Input id="kidsBratherAge2" {...register('kidsBratherAge2')} />
                </FormField>
                <FormField label="مدة الإخطار بتأخر الطفل (دقائق)" htmlFor="notefayKidsLate">
                  <Input id="notefayKidsLate" type="number" className="ltr-numerals" {...register('notefayKidsLate')} />
                </FormField>
                <FormField label="خصم التأخير (%)" htmlFor="lateDiscount">
                  <Input id="lateDiscount" type="number" className="ltr-numerals" {...register('lateDiscount')} />
                </FormField>
                <FormField label="خصم الغياب" htmlFor="absenceLate">
                  <Input id="absenceLate" type="number" className="ltr-numerals" {...register('absenceLate')} />
                </FormField>
                <FormField label="أيام الدراسة في الشهر" htmlFor="dayOfStaudyInMonth">
                  <Input id="dayOfStaudyInMonth" type="number" className="ltr-numerals" {...register('dayOfStaudyInMonth')} />
                </FormField>
                <FormField label="رصيد الإجازة الأول" htmlFor="vication1">
                  <Input id="vication1" type="number" className="ltr-numerals" {...register('vication1')} />
                </FormField>
                <FormField label="رصيد الإجازة الثاني" htmlFor="vication2">
                  <Input id="vication2" type="number" className="ltr-numerals" {...register('vication2')} />
                </FormField>
              </div>
              <label className="mt-4 flex items-center gap-2 text-sm text-neutral-700">
                <input type="checkbox" className="h-4 w-4 rounded border-neutral-300" {...register('isPayInBegning')} />
                الدفع في بداية الشهر
              </label>
            </Card>

            {/* الرواتب والاشتراك الافتراضي */}
            <Card className="p-6">
              <h2 className="mb-4 text-sm font-semibold text-neutral-700">الرواتب والاشتراك الافتراضي</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <FormField label="راتب المعلم الافتراضي" htmlFor="teacherSalary">
                  <Input id="teacherSalary" type="number" step="0.01" className="ltr-numerals" {...register('teacherSalary')} />
                </FormField>
                <FormField label="راتب العامل الافتراضي" htmlFor="workerSalary">
                  <Input id="workerSalary" type="number" step="0.01" className="ltr-numerals" {...register('workerSalary')} />
                </FormField>
                <FormField label="مبلغ اشتراك الطفل الافتراضي" htmlFor="childSubscriptionAmount">
                  <Input id="childSubscriptionAmount" type="number" step="0.01" className="ltr-numerals" {...register('childSubscriptionAmount')} />
                </FormField>
              </div>
            </Card>

            {/* إعدادات الطباعة */}
            <Card className="p-6">
              <h2 className="mb-4 text-sm font-semibold text-neutral-700">إعدادات الطباعة</h2>
              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-2 text-sm text-neutral-700">
                  <input type="checkbox" className="h-4 w-4 rounded border-neutral-300" {...register('smallPaper')} />
                  طباعة على ورق صغير (إيصالات)
                </label>
                <label className="flex items-center gap-2 text-sm text-neutral-700">
                  <input type="checkbox" className="h-4 w-4 rounded border-neutral-300" {...register('askBeforPrint')} />
                  السؤال قبل الطباعة
                </label>
                <label className="flex items-center gap-2 text-sm text-neutral-700">
                  <input type="checkbox" className="h-4 w-4 rounded border-neutral-300" {...register('showBeforPrint')} />
                  المعاينة قبل الطباعة
                </label>
              </div>
            </Card>

            {/* تكامل الرسائل SMS/WhatsApp */}
            <Card className="p-6">
              <h2 className="mb-4 text-sm font-semibold text-neutral-700">تكامل الرسائل (SMS / WhatsApp)</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField label="رقم مرسل SMS" htmlFor="smsNumber">
                  <Input id="smsNumber" className="ltr-numerals" {...register('smsNumber')} />
                </FormField>
                <FormField label="مفتاح API الخاص بـ SMS" htmlFor="smsNumberAPIKey">
                  <Input id="smsNumberAPIKey" type="password" {...register('smsNumberAPIKey')} />
                </FormField>
                <FormField label="رقم مرسل واتساب" htmlFor="whatsAppNumber">
                  <Input id="whatsAppNumber" className="ltr-numerals" {...register('whatsAppNumber')} />
                </FormField>
                <FormField label="مفتاح API الخاص بواتساب" htmlFor="whatsAppNumberAPIKey">
                  <Input id="whatsAppNumberAPIKey" type="password" {...register('whatsAppNumberAPIKey')} />
                </FormField>
              </div>
            </Card>

            {/* نماذج الرسائل */}
            <Card className="p-6">
              <h2 className="mb-4 text-sm font-semibold text-neutral-700">نماذج الرسائل التلقائية</h2>
              <div className="grid grid-cols-1 gap-4">
                <FormField label="رسالة الاشتراك الافتراضية" htmlFor="subMessage">
                  <Textarea id="subMessage" {...register('subMessage')} />
                </FormField>
                <FormField label="رسالة الغياب الافتراضية" htmlFor="absenceMessage">
                  <Textarea id="absenceMessage" {...register('absenceMessage')} />
                </FormField>
                <FormField label="رسالة سن الإخوة" htmlFor="brothersAgeMessage">
                  <Textarea id="brothersAgeMessage" {...register('brothersAgeMessage')} />
                </FormField>
                <FormField label="رسالة عيد الميلاد" htmlFor="birthDayMessage">
                  <Textarea id="birthDayMessage" {...register('birthDayMessage')} />
                </FormField>
                <FormField label="نص سن الموظف" htmlFor="empAge">
                  <Textarea id="empAge" {...register('empAge')} />
                </FormField>
              </div>
            </Card>

            <Button type="submit" className="self-start" isLoading={updateSettings.isPending}>حفظ كل الإعدادات</Button>
          </form>
        )}

        {/* النسخ الاحتياطي واستعادة قاعدة البيانات */}
        <Card className="p-6">
          <h2 className="mb-4 text-sm font-semibold text-neutral-700">النسخ الاحتياطي وقاعدة البيانات</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="flex flex-col gap-3">
              <FormField label="اسم النسخة الاحتياطية (اختياري)" htmlFor="backupName">
                <Input id="backupName" value={backupName} onChange={(e) => setBackupName(e.target.value)} placeholder="مثال: backup-2026-09" />
              </FormField>
              <Button
                type="button"
                variant="outline"
                icon={<DatabaseBackup className="h-4 w-4" />}
                isLoading={backupDatabase.isPending}
                onClick={() => backupDatabase.mutate(backupName || undefined)}
              >
                إنشاء نسخة احتياطية
              </Button>
            </div>

            <div className="flex flex-col gap-3">
              <FormField label="اسم ملف النسخة المراد استعادتها" htmlFor="restoreFileName">
                <Input id="restoreFileName" value={restoreFileName} onChange={(e) => setRestoreFileName(e.target.value)} placeholder="مثال: backup-2026-09.bak" />
              </FormField>
              <Button
                type="button"
                variant="outline"
                icon={<DatabaseZap className="h-4 w-4" />}
                isLoading={restoreDatabase.isPending}
                disabled={!restoreFileName}
                onClick={() => {
                  if (confirm('استعادة قاعدة البيانات ستستبدل البيانات الحالية بالكامل. هل أنت متأكد؟')) {
                    restoreDatabase.mutate(restoreFileName);
                  }
                }}
              >
                استعادة من نسخة احتياطية
              </Button>
              <p className="text-xs text-neutral-400">⚠️ عملية الاستعادة نهائية وتستبدل كل البيانات الحالية بالنسخة المختارة.</p>
            </div>
          </div>
        </Card>
      </div>
    </RoleGuard>
  );
}