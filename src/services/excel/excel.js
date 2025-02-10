// import { useMutation, useQuery } from '@tanstack/react-query';
// import { apiClient, URIS } from '..';

// export const getFeesDetails = (payload) => {
//     return useQuery({
//       queryKey: [URIS.GET_FEES, payload],
//       queryFn: async () => {
//         const res = await apiClient.get(URIS.LOGIN, payload);
//         if (res.ok) {
//           return res.data;
//         }
//         throw res?.data;
//       },
//       retry: false,
//     });
//   };

//   export const useGetSchool = (config) => {
//     return useMutation({
//       mutationKey: [URIS.LOGIN],
//       mutationFn: async (payload)=> {
//         const res = await apiClient.get(URIS.LOGIN);
//         if (res.ok) {
//           return res.data;
//         }
//         throw res?.data;
//       },
//       ...config,
//     });
//   };

