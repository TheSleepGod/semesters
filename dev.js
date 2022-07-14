const client = require('scp2');
//请不要短时间（10s内）多次上传，大流量写入会导致服务器寄掉！
client.scp('./dist/', {    // 本地打包文件的位置
    host: '43.142.82.180', // 服务器的IP地址
    port: '22',            // 服务器端口， 一般为 22
    username: 'root',       // 用户名                      
    password: '651216',     // 密码
    path: '/home/www'            // 项目部署的服务器目标位置
}, err =>{
    if (!err) {
        console.log("服务器部署完毕。")
    } else {
        console.log("err", err)
    }
})