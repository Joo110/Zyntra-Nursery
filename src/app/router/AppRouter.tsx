import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from '@/app/guards/ProtectedRoute';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { LoginPage } from '@/modules/Users/pages/LoginPage';
import { DashboardPage } from '@/modules/Dashboard/pages/DashboardPage';
import { BranchesPage } from '@/modules/Branches/pages/BranchesPage';
import { DepartmentsPage } from '@/modules/Departments/pages/DepartmentsPage';
import { ClassroomsPage } from '@/modules/Classrooms/pages/ClassroomsPage';
import { LevelsPage } from '@/modules/Levels/pages/LevelsPage';
import { ChildrenPage } from '@/modules/Children/pages/ChildrenPage';
import { ChildCreatePage } from '@/modules/Children/pages/ChildCreatePage';
import { ChildEditPage } from '@/modules/Children/pages/ChildEditPage';
import { ChildrenArchivePage } from '@/modules/Children/pages/ChildrenArchivePage';
import { ChildrenBirthdaysPage } from '@/modules/Children/pages/ChildrenBirthdaysPage';
import { BrothersPage } from '@/modules/Brothers/pages/BrothersPage';
import { GraduationPage } from '@/modules/Graduation/pages/GraduationPage';
import { TeachersPage } from '@/modules/Teachers/pages/TeachersPage';
import { WorkersPage } from '@/modules/Workers/pages/WorkersPage';
import { AttendancePage } from '@/modules/Attendance/pages/AttendancePage';
import { AbsencePage } from '@/modules/Absence/pages/AbsencePage';
import { DeparturePage } from '@/modules/Departure/pages/DeparturePage';
import { EvaluationsPage } from '@/modules/Evaluations/pages/EvaluationsPage';
import { EvaluationsWinnersPage } from '@/modules/Evaluations/pages/EvaluationsWinnersPage';
import { SubscriptionsPage } from '@/modules/Subscriptions/pages/SubscriptionsPage';
import { ChildrenSubscriptionInfoPage } from '@/modules/Subscriptions/pages/ChildrenSubscriptionInfoPage'; // جديد
import { TreasuryPage } from '@/modules/Treasury/pages/TreasuryPage';
import { SalariesPage } from '@/modules/Salaries/pages/SalariesPage';
import { BusesPage } from '@/modules/Buses/pages/BusesPage';
import { DriversPage } from '@/modules/Drivers/pages/DriversPage';
import { ChildAssessmentPage } from '@/modules/ChildAssessment/pages/ChildAssessmentPage';
import { MessageArchivePage } from '@/modules/MessageArchive/pages/MessageArchivePage';
import { RegistersOperationPage } from '@/modules/RegistersOperation/pages/RegistersOperationPage';
import { UsersPage } from '@/modules/Users/pages/UsersPage';
import { SettingsPage } from '@/modules/Settings/pages/SettingsPage';
import { NotFoundPage } from './NotFoundPage';
import { ForbiddenPage } from './ForbiddenPage';
import { ROUTES } from './routes.constants';

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={ROUTES.LOGIN} element={<LoginPage />} />
        <Route path={ROUTES.FORBIDDEN} element={<ForbiddenPage />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/" element={<Navigate to={ROUTES.DASHBOARD} replace />} />
            <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />

            <Route path={ROUTES.BRANCHES} element={<BranchesPage />} />
            <Route path={ROUTES.DEPARTMENTS} element={<DepartmentsPage />} />
            <Route path={ROUTES.CLASSROOMS} element={<ClassroomsPage />} />
            <Route path={ROUTES.LEVELS} element={<LevelsPage />} />

            <Route path={ROUTES.CHILDREN} element={<ChildrenPage />} />
            <Route path={ROUTES.CHILDREN_CREATE} element={<ChildCreatePage />} />
            <Route path="/children/:id/edit" element={<ChildEditPage />} />
            <Route path={ROUTES.CHILDREN_ARCHIVE} element={<ChildrenArchivePage />} />
            <Route path={ROUTES.CHILDREN_BIRTHDAYS} element={<ChildrenBirthdaysPage />} />

            <Route path={ROUTES.BROTHERS} element={<BrothersPage />} />
            <Route path={ROUTES.GRADUATION} element={<GraduationPage />} />
            <Route path={ROUTES.TEACHERS} element={<TeachersPage />} />
            <Route path={ROUTES.WORKERS} element={<WorkersPage />} />

            <Route path={ROUTES.ATTENDANCE} element={<AttendancePage />} />
            <Route path={ROUTES.ABSENCE} element={<AbsencePage />} />
            <Route path={ROUTES.DEPARTURE} element={<DeparturePage />} />

            <Route path={ROUTES.EVALUATIONS} element={<EvaluationsPage />} />
            <Route path={ROUTES.EVALUATIONS_WINNERS} element={<EvaluationsWinnersPage />} />

            <Route path={ROUTES.SUBSCRIPTIONS} element={<SubscriptionsPage />} />
            <Route path={ROUTES.CHILDREN_SUBSCRIPTION_INFO} element={<ChildrenSubscriptionInfoPage />} /> {/* جديد */}
            <Route path={ROUTES.TREASURY} element={<TreasuryPage />} />
            <Route path={ROUTES.SALARIES} element={<SalariesPage />} />
            <Route path={ROUTES.BUSES} element={<BusesPage />} />
            <Route path={ROUTES.DRIVERS} element={<DriversPage />} />
            <Route path={ROUTES.CHILD_ASSESSMENT} element={<ChildAssessmentPage />} />
            <Route path={ROUTES.MESSAGE_ARCHIVE} element={<MessageArchivePage />} />
            <Route path={ROUTES.REGISTERS_OPERATION} element={<RegistersOperationPage />} />

            <Route path={ROUTES.USERS} element={<UsersPage />} />
            <Route path={ROUTES.SETTINGS} element={<SettingsPage />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}