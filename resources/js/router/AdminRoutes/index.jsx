import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Route, Routes } from 'react-router-dom';

import { checkLogin, handleGetMe } from '../../adapter/AppAdapter';
import AdminLayout from '../../layouts/Admin';
import LoginLayout from '../../layouts/Login';
import Asset from '../../pages/Asset';
import AssignmentPage from '../../pages/Assignment';
import HomePage from '../../pages/Home';
import LoginPage from '../../pages/Login';
import RequestsPage from '../../pages/Requests';
import UserPage from '../../pages/User';
import { setExpiredToken, setIsLogin, setUser } from '../../redux/reducer/app/app.reducer';
import {
  isLoginSelector,
  keyAssignmentSelector,
  keyHomeSelector,
  keyRequestSelector,
  keyUserSelector,
} from '../../redux/selectors';
import ProtectedRoutes from '../ProtectedRoutes';

export default function AdminRoutes() {
  const dispatch = useDispatch();
  const isAuthenticate = useSelector(isLoginSelector);
  const keyHome = useSelector(keyHomeSelector);
  const keyUser = useSelector(keyUserSelector);
  const keyAsset = useSelector((state) => state.asset.key);
  const keyAssignment = useSelector(keyAssignmentSelector);
  const keyRequest = useSelector(keyRequestSelector);

  React.useEffect(() => {
    dispatch(setIsLogin(checkLogin()));
    if (checkLogin()) {
      handleGetMe().then((result) => {
        if (result !== 401) {
          dispatch(setUser(result));
        } else {
          dispatch(setExpiredToken(true));
          localStorage.removeItem('token');
        }
      });
    }
  }, [dispatch]);

  return (
    <Routes>
      <Route path="/login" element={<LoginLayout slot={<LoginPage />} />} />
      <Route element={<ProtectedRoutes isAuthenticate={isAuthenticate} />}>
        <Route path="/" element={<AdminLayout slot={<HomePage key={keyHome} />} />} />
        <Route path="/manage_user" element={<AdminLayout slot={<UserPage key={keyUser} />} />} />
        <Route path="/manage_asset" element={<AdminLayout slot={<Asset key={keyAsset} />} />} />
        <Route path="/manage_assignment" element={<AdminLayout slot={<AssignmentPage key={keyAssignment} />} />} />
        <Route path="/requests_for_returning" element={<AdminLayout slot={<RequestsPage key={keyRequest} />} />} />
      </Route>
    </Routes>
  );
}
