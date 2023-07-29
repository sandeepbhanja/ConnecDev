import {apiSlice} from './apiSlice.js';
import {USER_URL} from '../constant.js';

export const userApiSlice = apiSlice.injectEndpoints({
    endpoints:(builders)=>({
        editProfile: builders.mutation({
            query:(data)=>({
                url: USER_URL,
                method: 'PUT',
                body: data,
            })
        })
    })
})

export const {useEditProfileMutation} = userApiSlice;