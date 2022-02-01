import Button from '@enact/moonstone/Button';
import Changeable from '@enact/ui/Changeable';
import { Input } from '@enact/moonstone/Input';
import kind from '@enact/core/kind';
import { Panel } from '@enact/moonstone/Panels';
import React from 'react';
import Image from '@enact/moonstone/Image';
import Notification from '@enact/moonstone/Notification';
import BlackholeLogo from '../../../resources/img/logo.png';
import OctopyLogo from '../../../resources/img/brand.png';
import { login } from '../../providers/api/requests/auth';

import css from './MainPanel.less';
import propTypes from 'prop-types';

const MainPanel = kind({
  name: 'MainPanel',
  styles: {
    css,
    className: 'login'
  },
  props: {
    username: propTypes.string,
    onUsernameChange: propTypes.func,
    password: propTypes.string,
    onPasswordChange: propTypes.func,
    message: propTypes.string,
    onMessageChange: propTypes.func,
    onChangeIndex: propTypes.func
  },
  defaultProps: { username: '', password: '', message: '' },
  handlers: {
    onUsernameChange: (ev, { onUsernameChange }) => {
      onUsernameChange({ username: ev.value });
    },
    onPasswordChange: (ev, { onPasswordChange }) => {
      onPasswordChange({ password: ev.value });
    },
    onLogin: (ev, { username, password, onMessageChange, onChangeIndex }) => {
      login({ username, password })
        .then(response => {
          const perms = response.permissions;
          localStorage.perms = perms; //eslint-disable-line
          if (
            (perms['case_cut_graph'] === 'R' &&
              perms['events_graph'] === 'R') ||
            perms['all']
          ) {
            onChangeIndex(1);
          } else {
            onMessageChange({
              message:
                'No cuenta con los permisos necesarios para ver el dashboard (Gráfica de evidencias y Cortes de T.I.)'
            });
          }
        })
        .catch(e => {
          console.error(e);
          let errorMessage = '';
          switch (e.keyword) {
            case 'notFoundUsername':
              errorMessage = 'El nombre de usuario es incorrecto';
              break;
            case 'userAlreadyLogged':
              errorMessage = 'Ya tienes una sesión abierta en otra ventana';
              break;
            case 'invalidCredentials':
              errorMessage =
                'El nombre de usuario o la contraseña son incorrectos';
              break;
            default:
              errorMessage =
                'Ha ocurrido un error inesperado, por favor intentelo más tarde';
              break;
          }
          onMessageChange({ message: errorMessage });
        });
    },
    onClearMessage: (ev, { onMessageChange }) => {
      onMessageChange({ message: '' });
    }
  },
  render: ({
    onUsernameChange,
    username,
    onPasswordChange,
    password,
    onMessageChange,
    message,
    onLogin,
    ...props
  }) => (
    <Panel {...props}>
      <div className={css.loginForm}>
        <Image
          src={{ hd: BlackholeLogo, fhd: BlackholeLogo, uhd: BlackholeLogo }}
          className={css.logo}
        />
        <Input
          onChange={onUsernameChange}
          value={username}
          placeholder='Usuario'
          className={css.loginInput}
        />
        <Input
          type='password'
          onChange={onPasswordChange}
          value={password}
          placeholder='Contraseña'
          className={css.loginInput}
        />
        <Notification
          open={message.length !== 0}
          buttons={[<Button onClick={onMessageChange}>Cerrar</Button>]}
        >
          {message}
        </Notification>
        <Button
          disabled={username.length === 0 || password.length === 0}
          onClick={onLogin}
        >
          Iniciar Sesion
        </Button>
      </div>
      <Image
        src={{ hd: OctopyLogo, fhd: OctopyLogo, uhd: OctopyLogo }}
        className={css.brand}
      />
    </Panel>
  )
});

export default Changeable(
  {
    prop: 'username',
    change: 'onUsernameChange'
  },
  Changeable(
    {
      prop: 'password',
      change: 'onPasswordChange'
    },
    Changeable({ prop: 'message', change: 'onMessageChange' }, MainPanel)
  )
);
