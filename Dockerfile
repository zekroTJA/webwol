ARG GOOS=linux
ARG GOARCH=amd64

FROM node:alpine AS buildfe
WORKDIR /build
COPY web .
RUN yarn
RUN yarn run build

FROM golang:1.18rc1-alpine AS buildbe
WORKDIR /build
COPY . .
COPY --from=buildfe /build/dist ./internal/embedded/webdist
RUN GOOS=${GOOS} GOARCH=${GOARCH} go build -o bin/webwol cmd/webwol/main.go

FROM alpine:latest
WORKDIR /app
COPY --from=buildbe /build/bin/webwol /app/webwol
VOLUME ["/app/data"]
EXPOSE 80
ENTRYPOINT ["/app/webwol"]