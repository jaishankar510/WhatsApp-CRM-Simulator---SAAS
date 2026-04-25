
# WhatsApp CRM Platform

A complete WhatsApp Business CRM system that simulates onboarding, template creation, campaign sequencing, and messaging functionality. Built with Django, React, and MongoDB.

## 📋 Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [MongoDB Setup](#mongodb-setup)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [Testing Guide](#testing-guide)
- [Database Collections](#database-collections)
- [Troubleshooting](#troubleshooting)

## ✨ Features

### 1. WhatsApp Onboarding Flow
- 4-step business onboarding wizard
- Business details collection
- Industry selection (multi-select)
- Objectives selection (max 3)
- OTP generation & verification (mock)
- Meta verification simulation (Approved/Pending/Failed)

### 2. Template Management
- Create message templates with header, body, footer
- Support dynamic variables ({{name}}, {{company}})
- Live message preview
- Template list with status
- Delete templates
- **Stored in MongoDB**

### 3. Sequence Builder (4-Step)
- **Step 1:** Basic Info (name, type, retries)
- **Step 2:** Select Templates with delay & time settings
- **Step 3:** Add Recipients (manual entry)
- **Step 4:** Schedule (Immediate or Custom Date)
- **Stored in MongoDB**

### 4. List Views
- Templates list with status badges
- Sequences list with active/inactive toggle
- View/Delete actions
- **Data fetched from MongoDB**

### 5. WhatsApp Integration
- Meta verification status simulation
- Send test messages
- API connection status
- **Integration status stored in MongoDB**

## 🛠 Tech Stack

### Backend
- **Django 4.2.7** - Python Web Framework
- **Django REST Framework** - API development
- **MongoDB** - NoSQL Database
- **PyMongo** - MongoDB driver for Python

### Frontend
- **React 18** - UI Framework
- **Tailwind CSS** - Styling
- **React Router DOM** - Navigation
- **Axios** - API calls

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Python 3.8+** - [Download](https://www.python.org/downloads/)
- **MongoDB 6.0+** - [Download](https://www.mongodb.com/try/download/community)
- **npm** or **yarn** - Package manager

## 🗄️ MongoDB Setup

### Install MongoDB

#### Windows
1. Download MongoDB Community Edition from [MongoDB Download Center](https://www.mongodb.com/try/download/community)
2. Run the installer (select "Complete" setup)
3. Install MongoDB as a service (recommended)


