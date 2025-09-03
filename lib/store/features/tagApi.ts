import { baseApi } from '../baseApi'
import { z } from 'zod'

// Zod schemas for validation
const TagSchema = z.object({
  id: z.number(),
  name: z.string(),
  hits: z.number(),
})

const TagsResponseSchema = z.object({
  meta: z.object({
    code: z.number(),
    message: z.string(),
  }),
  data: z.object({
    tags: z.array(TagSchema),
  }),
})

const TagResponseSchema = z.object({
  meta: z.object({
    code: z.number(),
    message: z.string(),
  }),
  data: z.object({
    tag: TagSchema,
  }),
})

// Types
export type Tag = z.infer<typeof TagSchema>
export type TagsResponse = z.infer<typeof TagsResponseSchema>
export type TagResponse = z.infer<typeof TagResponseSchema>

export interface CreateTagDto {
  name: string
}

// API slice
export const tagApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTags: builder.query<Tag[], { search?: string }>({
      query: (params) => ({
        url: '/tags',
        params,
      }),
      transformResponse: (response: any) => {
        // Handle the case where response might be an array directly
        if (Array.isArray(response)) {
          return response
        }
        // Handle the wrapped response format
        if (response?.data?.tags) {
          return response.data.tags
        }
        // Fallback to empty array
        return []
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Tag' as const, id })),
              { type: 'Tag', id: 'LIST' },
            ]
          : [{ type: 'Tag', id: 'LIST' }],
    }),

    getTag: builder.query<Tag, number>({
      query: (id) => `/tags/${id}`,
      transformResponse: (response: any) => {
        if (response?.data?.tag) {
          return response.data.tag
        }
        return response
      },
      providesTags: (result, error, id) => [{ type: 'Tag', id }],
    }),

    createTag: builder.mutation<Tag, CreateTagDto>({
      query: (tag) => ({
        url: '/tags',
        method: 'POST',
        body: tag,
      }),
      transformResponse: (response: any) => {
        if (response?.data?.tag) {
          return response.data.tag
        }
        return response
      },
      invalidatesTags: [{ type: 'Tag', id: 'LIST' }],
    }),

    deleteTag: builder.mutation<void, number>({
      query: (id) => ({
        url: `/tags/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Tag', id: 'LIST' }],
    }),
  }),
})

// Export hooks for usage in components
export const {
  useGetTagsQuery,
  useGetTagQuery,
  useCreateTagMutation,
  useDeleteTagMutation,
} = tagApi