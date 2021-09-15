import React from 'react';
import { ErrorText, Loader } from './Feedbacks';

interface IProps {
  isLoading: boolean;
  isError: boolean;
  children?: any;
}

export default function QueryWrapper({
  isLoading,
  isError,
  children = null,
}: IProps) {
  if (isLoading) return <Loader />;
  if (isError) return <ErrorText />;

  return children;
}
