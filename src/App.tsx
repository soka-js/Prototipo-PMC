import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AppShell } from '@/components/layout/AppShell';
import { MerchantLayout } from '@/components/layout/MerchantLayout';
import { UserLayout } from '@/components/layout/UserLayout';
import { AlertScreen } from '@/components/user/AlertScreen';
import { ConnectScreen } from '@/components/user/ConnectScreen';
import { HomeScreen } from '@/components/user/HomeScreen';
import { OffersScreen } from '@/components/user/OffersScreen';
import { ResponseNegativeScreen } from '@/components/user/ResponseNegativeScreen';
import { ResponsePositiveScreen } from '@/components/user/ResponsePositiveScreen';
import { SavingsConfirmationScreen } from '@/components/user/SavingsConfirmationScreen';
import { SimulateScreen } from '@/components/user/SimulateScreen';
import { SubscriptionsScreen } from '@/components/user/SubscriptionsScreen';
import { CampaignResultsScreen } from '@/components/merchant/CampaignResultsScreen';
import { ChatQueryScreen } from '@/components/merchant/ChatQueryScreen';
import { CreateOfferDiscountScreen } from '@/components/merchant/CreateOfferDiscountScreen';
import { CreateOfferProductScreen } from '@/components/merchant/CreateOfferProductScreen';
import { DashboardScreen } from '@/components/merchant/DashboardScreen';
import { OnboardingScreen } from '@/components/merchant/OnboardingScreen';
import { WeeklyReportScreen } from '@/components/merchant/WeeklyReportScreen';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route index element={<Navigate to="/user/connect" replace />} />

          <Route path="user" element={<UserLayout />}>
            <Route index element={<Navigate to="connect" replace />} />
            <Route path="connect" element={<ConnectScreen />} />
            <Route path="home" element={<HomeScreen />} />
            <Route path="simulate" element={<SimulateScreen />} />
            <Route path="response-positive" element={<ResponsePositiveScreen />} />
            <Route path="response-negative" element={<ResponseNegativeScreen />} />
            <Route path="subscriptions" element={<SubscriptionsScreen />} />
            <Route path="alert" element={<AlertScreen />} />
            <Route path="offers" element={<OffersScreen />} />
            <Route path="savings-confirmation" element={<SavingsConfirmationScreen />} />
          </Route>

          <Route path="merchant" element={<MerchantLayout />}>
            <Route index element={<Navigate to="onboarding" replace />} />
            <Route path="onboarding" element={<OnboardingScreen />} />
            <Route path="weekly-report" element={<WeeklyReportScreen />} />
            <Route path="create-offer-1" element={<CreateOfferProductScreen />} />
            <Route path="create-offer-2" element={<CreateOfferDiscountScreen />} />
            <Route path="campaign-results" element={<CampaignResultsScreen />} />
            <Route path="chat-query" element={<ChatQueryScreen />} />
            <Route path="dashboard" element={<DashboardScreen />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
