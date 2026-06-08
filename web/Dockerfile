FROM nginx:alpine

# 소스 파일 복사
COPY ./web/src /usr/share/nginx/html

# nginx 설정 적용
COPY ./web/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
