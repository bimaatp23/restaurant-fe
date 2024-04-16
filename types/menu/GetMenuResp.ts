import type { BaseResp } from 'BaseResp'
import type { Menu } from './Menu'

export interface GetMenuResp extends BaseResp {
    output_schema: Menu[]
}
