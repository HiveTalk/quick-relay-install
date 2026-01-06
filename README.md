# 1 Shot Deploy - Nostr Blossom Relay

A comprehensive deployment guide and checklist for setting up Swarm Nostr relays on Zeabur cloud platform. Swarm is a Nostr relay implementation using the Khatru relay framework and Blossom media support.


https://github.com/user-attachments/assets/cdfdde0c-488a-4e96-9426-16bef1a239ef




## Overview

This repository provides a step-by-step web interface for deploying HiveTalk Swarm (a Nostr relay implementation) to Zeabur with minimal configuration. The guide includes:

- **Interactive checklist** with progress tracking
- **Environment variable configuration** guidance
- **Database setup** options (Badger DB, PostgreSQL)
- **S3 storage** configuration for Blossom media
- **Domain setup** instructions
- **Troubleshooting** guidance

## Features

- 📋 **Interactive Checklist**: Click-to-track progress through deployment steps
- 🎨 **Dark/Light Theme**: Toggle between themes for comfortable viewing
- 📺 **Video Tutorial**: Embedded introduction to Zeabur platform
- ⚙️ **Configuration Templates**: Copy-paste ready environment variable examples
- 🔗 **Resource Links**: Quick access to relevant documentation and services

## Quick Start

1. Open `index.html` in your web browser
2. Follow the step-by-step checklist
3. Use the embedded configuration examples
4. Track your progress as you deploy

## Prerequisites

- Zeabur account
- GitHub account  
- Domain with NIP-05/nostr.json configuration
- Basic understanding of environment variables

## Repository Structure

```
quick-relay-install/
├── index.html              # Main deployment guide web interface
├── public/
│   └── domain-zeabur.png   # Domain setup screenshot
└── README.md               # This file
```

## Target Application

This guide is specifically for deploying:
- **Repository**: https://github.com/HiveTalk/swarm
- **Platform**: Zeabur cloud hosting
- **Technology**: Go-based Nostr relay with Blossom media support

## Support

For issues related to:
- **HiveTalk Swarm**: Visit the [HiveTalk Swarm GitHub](https://github.com/HiveTalk/swarm)
- **Zeabur Platform**: Check [Zeabur Documentation](https://zeabur.com/docs)
- **NIP-05 Service**: Use the [nip05-service repository](https://github.com/bitkarrot/nip05-service.git)

## License

This deployment guide is provided as-is for educational and deployment purposes.
