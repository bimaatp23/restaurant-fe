import type { BaseResp } from 'BaseResp';
import type { Session } from 'Session';

export interface LoginCustomerResp extends BaseResp {
    output_schema: Session;
}
