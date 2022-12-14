import { createSlice } from '@reduxjs/toolkit';

import { formatDate } from '../../../utils/formatDate';

export const userReducer = createSlice({
  name: 'user',
  initialState: {
    key: 0,
    isAdd: false,
    isEdit: false,
    user: {},
  },
  reducers: {
    setKey: (state, action) => {
      state.key = action.payload;
    },
    setResetState: (state) => {
      state.isAdd = false;
      state.isEdit = false;
      state.user = {};
    },
    setIsAdd: (state, action) => {
      state.isAdd = action.payload;
    },
    setIsEdit: (state, action) => {
      state.isEdit = action.payload;
    },
    setUser: (state, action) => {
      const user = { ...action.payload };
      user.joined_date = formatDate(user.joined_date, 'yyyy-MM-DD');
      user.date_of_birth = formatDate(user.date_of_birth, 'yyyy-MM-DD');
      state.user = { ...user };
    },
  },
});

export const { setIsAdd, setIsEdit, setUser, setResetState, setKey } = userReducer.actions;
export default userReducer.reducer;
