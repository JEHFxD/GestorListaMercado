import React, { useState, useEffect } from 'react';
import { auth } from '../../assets/firebase.config';
import {signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider,
  GithubAuthProvider, onAuthStateChanged, signOut, linkWithCredential,FacebookAuthProvider} from 'firebase/auth';

const Login = () => {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState(null);
  const [isLogin, setIsLogin] = useState(true);

  const providers = {
    google: new GoogleAuthProvider(),
    github: new GithubAuthProvider(),
    facebook: new FacebookAuthProvider()
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return () => unsubscribe();
  }, []);

  const handleAuth = async (e) => {
    e.preventDefault();
    setError(null);
    const { email, password } = formData;
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  
  const handleSocialLogin = async (provider) => {
    try {
      if (auth.currentUser) {
        await signOut(auth);
      }
  
      const result = await signInWithPopup(auth, providers[provider]);
      const userCredential = result.user;
      const linkedProviders = userCredential.providerData.map((provider) => provider.providerId);
  
      if (linkedProviders.includes(providers[provider].providerId)) {
        setUser(userCredential);
        return;
      }
  
      if (auth.currentUser) {
        const credential = provider === 'google'
          ? GoogleAuthProvider.credentialFromResult(result)
          : provider === 'github'
          ? GithubAuthProvider.credentialFromResult(result)
          : FacebookAuthProvider.credentialFromResult(result);
  
        await linkWithCredential(auth.currentUser, credential);
      }
  
      setUser(userCredential);
    } catch (error) {
      console.error(error);
      const errorMessage = provider === 'google'
        ? 'Error al iniciar sesión con Google. Intente de nuevo.'
        : provider === 'github'
        ? 'Error al iniciar sesión con GitHub. Intente de nuevo.'
        : 'Error al iniciar sesión con Facebook. Intente de nuevo.';
      setError(errorMessage);
    }
  };

  const toggleLogin = () => setIsLogin(!isLogin);
  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  return (
    <div>
      {user ? (
        <div>
          <h2>Bienvenido {user.email}</h2>
          <button onClick={() => signOut(auth)}>Cerrar Sesión</button>
        </div>
      ) : (
        <div>
          <h2>{isLogin ? 'Login' : 'Register'}</h2>
          <form onSubmit={handleAuth}>
            <div>
              <label>Email:</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} required />
            </div>
            <div>
              <label>Contraseña:</label>
              <input type="password" name="password" value={formData.password} onChange={handleChange} required />
            </div>
            <button type="submit">{isLogin ? 'Iniciar Sesión' : 'Registrarse'}</button>
          </form>
          <button onClick={toggleLogin}>
            {isLogin ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión'}
          </button>
          <hr />
          <button className="google-button" onClick={() => handleSocialLogin('google')}>Iniciar sesión con Google</button>
          <button className="github-button" onClick={() => handleSocialLogin('github')}>Iniciar sesión con GitHub</button>
          <button className="facebook-button" onClick={() => handleSocialLogin('facebook')}>Iniciar sesión con Facebook</button>
          {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
      )}
    </div>
  );
};

export { Login };
