import { Injectable } from '@angular/core';

export class SubMenu {
    title: string;
    resource: string;
}

export class Menu {
    id: number;
    iconSrc: string;
    // iconActionSrc: string;
    title: string;
    subMenus: SubMenu[];
}

@Injectable()
export class MenuService {
    menus: Menu[] = [{
        id: 1,
        iconSrc: 'icon-menu-set',
        // iconActionSrc: 'app/images/menu-set-a.svg',
        title: '审方设置',
        subMenus: [
            { title: '审方方案设置', resource: 'page/audit-setting' }
        ]
    }, {
        id: 2,
        iconSrc: 'icon-menu-audit',
        // iconActionSrc: 'app/images/menu-audit-a.svg',
        title: '处方/医嘱审核',
        subMenus: [
            { title: '门诊处方审核', resource: 'page/opt-audit-plan-choose' },
            { title: '住院医嘱审核', resource: 'page/ipt-audit-plan-choose' }
        ]
    }, {
        id: 3,
        iconSrc: 'icon-menu-result',
        // iconActionSrc: 'app/images/menu-result-a.svg',
        title: '审核结果查看',
        subMenus: [
            { title: '已审门诊处方查看', resource: 'page/opt-recipe-review' },
            { title: '已审住院医嘱查看', resource: 'page/ipt-recipe-review' }
        ]
    }, {
        id: 4,
        iconSrc: 'icon-menu-statistics',
        // iconActionSrc: 'app/images/menu-statistics-a.svg',
        title: '审方工作分析',
        subMenus: [
            { title: '药师工作统计', resource: 'page/pharmacists-statistic' },
            { title: '审方质量评价', resource: 'page/quality-evaluat' },
            { title: '评价结果查看', resource: 'page/personal-quality' }
        ]
    }, {
        id: 5,
        iconSrc: 'icon-menu-alert-message',
        // iconActionSrc: 'app/images/menu-alert-message-a.svg',
        title: '警示信息管理',
        subMenus: [
            { title: '用药警示管理', resource: 'page/alert-message' },
            // { title: '用药警示管理-个人', resource: 'page/alert-message-person' },
            // { title: '用药警示管理-管理', resource: 'page/alert-message-master' }
        ]
    }];
}