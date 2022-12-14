import React from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { yupResolver } from '@hookform/resolvers/yup';
import PropTypes from 'prop-types';

import { changePassword, schemaChangePassword } from '../../../adapter/AppAdapter';
import { setExpiredToken } from '../../../redux/reducer/app/app.reducer';
import Modal from '../../Layouts/Modal';

import './style.css';

export default function ChangePassword(props) {
  const dispatch = useDispatch();
  const [typeOldPassword, setShowOldPassword] = React.useState('password');
  const [typeNewPassword, setShowNewPassword] = React.useState('password');
  const [backdrop, setBackdrop] = React.useState('static');
  const [changePasswordSuccess, setChangePasswordSuccess] = React.useState(false);

  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isValid },
  } = useForm({
    mode: 'onChange',
    resolver: yupResolver(schemaChangePassword),
  });

  const onSubmit = async (data) => {
    setBackdrop('static');
    const status = await changePassword(data, 'no_notification');
    switch (status) {
      case 401:
        props.setStateModal();
        dispatch(setExpiredToken(true));
        localStorage.removeItem('token');
        break;
      case 403:
        setError(
          'old_password',
          {
            types: {
              wrong: 'Password is incorrect',
            },
          },
          { shouldFocus: true }
        );
        setBackdrop('static');
        break;
      case 422:
        setError(
          'new_password',
          {
            types: {
              invalid: 'Password is invalid',
            },
          },
          { shouldFocus: true }
        );
        setBackdrop('static');
        break;
      case 200:
        setBackdrop('static');
        setChangePasswordSuccess(true);
        setStateModal('keep');
    }
  };

  const setStateModal = (value) => {
    reset({
      new_password: '',
      old_password: '',
    });
    if (value !== 'keep') {
      props.setStateModal();
    }
  };

  return (
    <Modal
      show={props.show}
      backdrop={backdrop}
      setStateModal={() => {
        setStateModal();
        setChangePasswordSuccess(false);
      }}
      elementModalTitle={<p>Change password</p>}
      elementModalBody={
        !changePasswordSuccess ? (
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Form.Group className="custom-change-password mb-3">
              <Row className="align-items-center">
                <Col xs={4}>
                  <Form.Label className="font-weight-bold mb-0">Old password</Form.Label>
                </Col>
                <Col xs={8}>
                  <div className="cp-input">
                    <Form.Control {...register('old_password')} type={typeOldPassword} />
                    <small className="text-danger font-weight-bold">{errors?.old_password?.types?.wrong}</small>
                    {typeOldPassword === 'text' ? (
                      <FaEye className="text-black" onClick={() => setShowOldPassword('password')} />
                    ) : (
                      <FaEyeSlash className="text-black" onClick={() => setShowOldPassword('text')} />
                    )}
                  </div>
                </Col>
              </Row>
            </Form.Group>
            <Form.Group className="custom-change-password mb-3">
              <Row className="align-items-center">
                <Col xs={4}>
                  <Form.Label className="font-weight-bold mb-0">New password</Form.Label>
                </Col>
                <Col xs={8}>
                  <div className="cp-input">
                    <Form.Control {...register('new_password')} type={typeNewPassword} />
                    {errors?.new_password?.type === 'new_password' ? (
                      <small className="text-danger font-weight-bold">{errors?.new_password?.message}</small>
                    ) : (
                      <small className="text-danger font-weight-bold">{errors?.new_password?.types?.invalid}</small>
                    )}
                    {typeNewPassword === 'text' ? (
                      <FaEye className="text-black" onClick={() => setShowNewPassword('password')} />
                    ) : (
                      <FaEyeSlash className="text-black" onClick={() => setShowNewPassword('text')} />
                    )}
                  </div>
                </Col>
              </Row>
            </Form.Group>
            <div className="text-justify mb-3">
              <small>
                (*) New password must be at least contain&nbsp;<span className="font-weight-bold">8 Characters</span>
                ,&nbsp;
                <span className="font-weight-bold">One Uppercase</span>,&nbsp;
                <span className="font-weight-bold">One Lowercase</span>,&nbsp;
                <span className="font-weight-bold">One Number</span>&nbsp;and&nbsp;
                <span className="font-weight-bold">One Special Case Character</span>
              </small>
            </div>
            <Form.Group className="d-flex justify-content-end">
              <Button type="submit" variant="danger" disabled={!isValid} className="me-3 font-weight-bold">
                Save
              </Button>
              <Button type="button" variant="secondary" className="font-weight-bold" onClick={() => setStateModal()}>
                Cancel
              </Button>
            </Form.Group>
          </Form>
        ) : (
          <>
            <h6 className="mb-3">Your password has been changed successfully</h6>
            <div className="d-flex justify-content-end">
              <Button
                type="button"
                variant="outline-secondary"
                className="font-weight-bold"
                onClick={() => {
                  setStateModal();
                  setChangePasswordSuccess(false);
                }}
              >
                Close
              </Button>
            </div>
          </>
        )
      }
    />
  );
}

ChangePassword.propTypes = {
  show: PropTypes.bool.isRequired,
  setStateModal: PropTypes.func.isRequired,
};
