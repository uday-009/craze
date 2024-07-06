import requests from "./httpService";

export const userServices = {
    getUsersList: () =>  requests.get('/users/users'),

    getGamesList: () => requests.get(`/dashboard/games`)
}