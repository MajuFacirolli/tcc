export const JOB_NAMES = {} as const

export type JobName = (typeof JOB_NAMES)[keyof typeof JOB_NAMES]
