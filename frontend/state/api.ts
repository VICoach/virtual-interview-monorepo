import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BaseQueryApi, FetchArgs } from "@reduxjs/toolkit/query";
import { toast } from "sonner";
import { create } from "domain";

const skipToastEndpoints = ["verifyEmail"];

export const customBaseQuery = async (
  args: string | FetchArgs,
  api: BaseQueryApi,
  extraOptions: any,
) => {
  const baseQuery = fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_BASE_URL,
    credentials: "include",
    prepareHeaders: async (headers) => {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  });
  try {
    let result: any = await baseQuery(args, api, extraOptions);

    if (result.error?.status === 401) {
      const refresh: any = await baseQuery(
        {
          url: "/auth/refresh-token",
          method: "POST",
        },
        api,
        extraOptions,
      );
      if (refresh.data?.data?.access_token) {
        const newToken = refresh.data.data.access_token;
        localStorage.setItem("token", newToken);
        result = await baseQuery(args, api, extraOptions);
      } else {
        toast.error("Session expired. Please log in again.");
        localStorage.removeItem("token");
        return { error: { status: 401, error: "Unauthorized" } };
      }
    }

    const endpointName = api.endpoint ?? "";
    const shouldSkip = skipToastEndpoints.includes(endpointName);

    if (!shouldSkip && result.error) {
      const errorData = result.error.data;
      const errorMessage =
        errorData?.message ||
        result.error.status.toString() ||
        "An error occurred";
      toast.error(`${errorMessage}`);
    }

    const isMutationRequest =
      (args as FetchArgs).method && (args as FetchArgs).method !== "GET";
    if (!shouldSkip && isMutationRequest) {
      const messages = [
        result.data?.message,
        result.data?.data?.message,
      ].filter(Boolean);
      messages.forEach((message) => toast.success(message));
    }

    if (result.data) {
      result.data = result.data.data;
    } else if (
      result.error?.status === 204 ||
      result.meta?.response?.status === 24
    ) {
      return { data: null };
    }
    if (result.data === undefined && result.error === undefined) {
      return { data: null };
    }
    return result;
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    return { error: { status: "FETCH_ERROR", error: errorMessage } };
  }
};

export const api = createApi({
  baseQuery: customBaseQuery,
  reducerPath: "api",
  tagTypes: ["User"],
  endpoints: (builder) => ({
    /*
    =================
    USER ENDPOINTS
    =================
    */
    registerUser: builder.mutation({
      query: (userData) => ({
        url: "/auth/register",
        method: "POST",
        body: userData,
      }),
      invalidatesTags: ["User"],
    }),
    loginUser: builder.mutation({
      query: (userData) => ({
        url: "/auth/login",
        method: "POST",
        body: userData,
      }),
      invalidatesTags: ["User"],
    }),
    verifyEmail: builder.mutation<ApiResponse, { token: string }>({
      query: (token) => ({
        url: "/auth/verify-email",
        method: "POST",
        body: token,
      }),
      invalidatesTags: ["User"],
    }),
    sendVerificationEmail: builder.mutation<ApiResponse, { email: string }>({
      query: (email) => ({
        url: "/auth/send-verify-email",
        method: "POST",
        body: email,
      }),
      invalidatesTags: ["User"],
    }),
    forgotPassword: builder.mutation<ApiResponse, { email: string }>({
      query: (email) => ({
        url: "/auth/forgot-password",
        method: "POST",
        body: email,
      }),
      invalidatesTags: ["User"],
    }),
    resetPassword: builder.mutation<ApiResponse, ResetPasswordRequest>({
      query: ({ token, newPassword, confirmPassword }) => ({
        url: "/auth/reset-password",
        method: "POST",
        body: { token, newPassword, confirmPassword },
      }),
      invalidatesTags: ["User"],
    }),
    getUser: builder.query({
      query: () => ({
        url: "/auth/user",
        method: "GET",
      }),
      providesTags: ["User"],
    }),

    createInterview: builder.mutation({
      query: (interviewData) => ({
        url: "/interview",
        method: "POST",
        body: interviewData,
      }),
    }),
  }),
});

export const {
  useRegisterUserMutation,
  useLoginUserMutation,
  useVerifyEmailMutation,
  useSendVerificationEmailMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useGetUserQuery,
  useCreateInterviewMutation,
} = api;
