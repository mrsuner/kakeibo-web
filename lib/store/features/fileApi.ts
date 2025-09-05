import { fileBaseApi } from '../fileBaseApi'
import { z } from 'zod'

// Zod schema for file upload response
const FileSchema = z.object({
  id: z.string(), // UUID
  path: z.string(),
  driver: z.string(),
  mimeType: z.string(),
  extension: z.string(),
  originalName: z.string(),
  size: z.number(),
  url: z.string(),
  expiresAt: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

const FileUploadResponseSchema = z.object({
  meta: z.object({
    code: z.number(),
    message: z.string(),
  }),
  data: z.object({
    file: FileSchema,
  }),
})

// Types
export type File = z.infer<typeof FileSchema>
export type FileUploadResponse = z.infer<typeof FileUploadResponseSchema>

// API slice
export const fileApi = fileBaseApi.injectEndpoints({
  endpoints: (builder) => ({
    uploadFile: builder.mutation<File, FormData>({
      query: (formData) => ({
        url: '/files',
        method: 'POST',
        body: formData,
      }),
      transformResponse: (response: any) => {
        if (response?.data?.file) {
          return response.data.file
        }
        return response
      },
    }),
  }),
})

// Export hooks for usage in components
export const {
  useUploadFileMutation,
} = fileApi