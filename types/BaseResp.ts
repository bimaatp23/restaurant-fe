export interface BaseResp {
    error_schema: {
        error_code: number;
        error_message: string;
    };
    output_schema?: any;
}
