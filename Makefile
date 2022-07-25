NAME = foobar
VERSION = 0.0.1

.PHONY: all build build-linux build-osx build-osx-arm

all: build

build: build-linux build-osx build-osx-arm

build-linux:
	deno compile  --allow-read --allow-run --allow-env --allow-write --target=x86_64-unknown-linux-gnu --output dist/via-linux-x86_64 ./src/via.ts
build-osx:
	deno compile  --allow-read --allow-run --allow-env --allow-write --target=x86_64-apple-darwin --output dist/via-apple-x86_64 ./src/via.ts
build-osx-arm:
	deno compile  --allow-read --allow-run --allow-env --allow-write --target=aarch64-apple-darwin --output dist/via-apple-arm ./src/via.ts

# Necessary ENV-Vars
# export VIA_VERSION=v0.3.1 # must match git tag
# export VIA_LINUX_HASH=$(md5sum dist/via-linux-x86_64)
# export PACKAGE_VERSION=1
release-aur-bin:
	cd ./distribution/aur-bin/ && \
	# git pull && \
	envsubst '$${VIA_VERSION} $${VIA_LINUX_HASH} $${PACKAGE_VERSION}' < PKGBUILD.template > PKGBUILD && \
	makepkg --printsrcinfo > .SRCINFO && \
	git add . && \
	git commit -m "update package to $${VIA_VERSION}-$${PACKAGE_VERSION}" && \
	git push

release-aur-git:
	cd ./distribution/aur-git/ && \
	rm -rf pkg "via-git*" src && \
	envsubst '$${VIA_VERSION} $${PACKAGE_VERSION}' < PKGBUILD.template > PKGBUILD && \
	makepkg --printsrcinfo > .SRCINFO && \
	git add . && \
	git commit -m "update package to $${VIA_VERSION}-$${PACKAGE_VERSION}" && \
	git push

release-flatpak: build-linux
	cp ./dist/via-linux-x86_64 ./distribution/flatpak/via \
	cd ./distribution/flatpak/ && \
	flatpak-builder . de.sopamo.via
	# envsubst '$${VIA_VERSION} $${PACKAGE_VERSION}' < PKGBUILD.template > PKGBUILD && \
	# git add . && \
	# git commit -m "update package" && \
	# git push

