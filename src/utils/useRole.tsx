import React, {useMemo} from 'react';
import {useSelector} from 'react-redux';
import {RootState} from '../redux/slices';

export default function useRole() {
  const {user} = useSelector((state: RootState) => state.userState);

  const roles = useMemo(
    () => ({isBoss: user?.role == 'boss', isManager: user?.role == 'manager'}),
    [user],
  );

  return roles;
}
