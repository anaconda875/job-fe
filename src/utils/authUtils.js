import jwtDecode from 'jwt-decode';

const AUTH_USER_KEY = 'signInUserSession';

/**
 * Checks if user is authenticated
 */
const isUserAuthenticated = () => {
  const user = getLoggedInUser();
  if (!user) {
    return false;
  }
  const decoded = jwtDecode(user.accessToken);
  const currentTime = Date.now() / 1000;
  const isTokenExpired = decoded.exp < currentTime;
  isTokenExpired && console.warn('Access token expired');
  return !isTokenExpired;
};

/**
 * Returns the logged in user
 */
const getLoggedInUser = () => {
  let user = localStorage.getItem(AUTH_USER_KEY);
  if (user) {
    user = JSON.parse(user);
  }
  return user;
};


// TODO remove tmp data
const getUserDataFromToken = (authenticatedData) => {
  try {
    const token = authenticatedData.accessToken;
    const payload = jwtDecode(token);
    //const payload = JSON.parse(decoded.sub);
    let permissions = [];
    const screenCodes = new Set();
    const roles = new Set();
    const user = authenticatedData.user;

    user.authorities.forEach((authority) => {
      roles.add(authority.role);
      permissions = permissions.concat(authority.permissions);
    });
    return {
      id: user.id,
      firstName: payload.family_name,
      lastName: payload.given_name,
      name: payload.name,
      email: payload.email || 'user@pic.edu.vn',
      roles: [...roles],
      screenCodes: [...screenCodes],
      permissions: [...new Set(permissions)]
    };
  } catch (e) {
    console.error(e);
  }
};

export {
  isUserAuthenticated,
  getLoggedInUser,
  getUserDataFromToken,
  AUTH_USER_KEY,
};
