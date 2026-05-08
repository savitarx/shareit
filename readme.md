# WeChat

start the app → docker-compose up

start the backend tunnel and frontend tunnel → cloudflared tunnel —url http://localhost:8000
frontend tunnel -> cloudflared tunnel --url http://localhost:3000

send the frontend link to access the app 

check the db

docker exec -it shareit-postgres psql -U postgres -d shareit

db is connect , use queries to check the data