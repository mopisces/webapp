# webapp
webapp前端页面
开启apache Gzip
1.打开下面模块
LoadModule deflate_module modules/mod_deflate.so
LoadModule headers_module modules/mod_headers.so
LoadModule filter_module modules/mod_filter.so
2.在配置文件httpd.conf中配置
<IfModule mod_deflate.c>
    SetOutputFilter DEFLATE
    DeflateCompressionLevel 9
    SetEnvIfNoCase Request_URI .(?:gif|jpe?g|png)$ no-gzip dont-vary
    
    AddOutputFilterByType DEFLATE text/*
    AddOutputFilterByType DEFLATE application/ms* application/vnd* application/postscript application/javascript application/x-javascript
    AddOutputFilterByType DEFLATE application/x-httpd-php application/x-httpd-fastphp
    
    BrowserMatch ^Mozilla/4 gzip-only-text/html
    BrowserMatch ^Mozilla/4.0[678] no-gzip
    BrowserMatch \bMSIE !no-gzip !gzip-only-text/html
</IfModule>