import axios from 'axios';

const USER_SERVICE_URL = 'http://localhost:8082';
const PRODUCT_SERVICE_URL = 'http://localhost:8081';

const createApiClient = (baseURL: string) => {

    const client = axios.create({
        baseURL,
        headers: {
            'Content-Type': 'application/json'
        }
    });

    client.interceptors.request.use(
        (config) => {

            const storedSession = sessionStorage.getItem('shopsphere_auth');

            if (storedSession) {
                const session = JSON.parse(storedSession);

                if (session.accessToken) {
                    config.headers.Authorization =
                        `Bearer ${session.accessToken}`;
                }
            }

            return config;
        },
        (error) => Promise.reject(error)
    );

    return client;
};

export const userApiClient = createApiClient(USER_SERVICE_URL);

export const productApiClient = createApiClient(PRODUCT_SERVICE_URL);