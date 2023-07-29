import{apiSlice} from '../slices/apiSlice.js';
import { CHAT_URL } from '../constant.js';

export const chatApiSlice = apiSlice.injectEndpoints({
    endpoints: (builders)=>({
        accessChat : builders.mutation({
            query:(data)=>({
                url:CHAT_URL,
                method: 'POST',
                body: data
            })
        }),
        fetchChat : builders.query({
            query:()=>({
                url:CHAT_URL,
                method: 'GET',
            })
        })
    })
})


export const {useAccessChatMutation,useFetchChatQuery} = chatApiSlice;