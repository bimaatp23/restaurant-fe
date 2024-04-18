import type { BaseResp } from 'BaseResp';
import type { Session } from 'Session';

export interface LoginAdminResp extends BaseResp {
    output_schema: Session;
}
