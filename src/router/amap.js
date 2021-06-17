/*获取指定位置的经纬度*/
const getLocation  = () => import('@/components/amap/GetLocation');
/*获取与指定位置的距离*/
const distance     = () => import('@/components/amap/DistanceTest');
/*排货地图功能*/
const discharge    = () => import('@/components/amap/DischargeAmap');
/*司机端获取定位地址*/
const point    = () => import('@/components/amap/GetPoint');
let amap = [
    {
        path : '/amap/discharge',
        component: discharge,
        meta:{ title: '排货地图功能' }
    },
    {
        path : '/amap/distance',
        component: distance,
        meta:{ title: '获取目标位置距离' }
    },
    {
        path : '/amap/getLocation',
        component: getLocation,
        meta:{ title: '获取客户送货地址经纬度' }
    },
    {
        path : '/amap/getPoint',
        component: point,
        meta:{ title: '司机端获取定位地址' }
    }
];

export default amap;