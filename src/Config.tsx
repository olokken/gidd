const token = localStorage.getItem('token');
const config = {
    headers: {
        token: token,
    }
}

export default config;