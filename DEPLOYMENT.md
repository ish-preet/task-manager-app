# Deployment Guide

This guide covers deploying TaskFlow to various platforms.

## Table of Contents
- [Heroku Deployment](#heroku-deployment)
- [DigitalOcean Deployment](#digitalocean-deployment)
- [AWS Deployment](#aws-deployment)
- [Production Checklist](#production-checklist)

---

## Heroku Deployment

### Prerequisites
- Heroku account
- Heroku CLI installed
- Git installed

### Steps

1. **Login to Heroku**
   ```bash
   heroku login
   ```

2. **Create a new Heroku app**
   ```bash
   heroku create your-app-name
   ```

3. **Add MongoDB Atlas**
   - Sign up at https://www.mongodb.com/cloud/atlas
   - Create a free cluster
   - Get your connection string
   - Add to Heroku:
   ```bash
   heroku config:set MONGODB_URI="mongodb+srv://username:password@cluster.mongodb.net/taskmanager"
   ```

4. **Set environment variables**
   ```bash
   heroku config:set JWT_SECRET="your-production-secret-key"
   heroku config:set NODE_ENV="production"
   ```

5. **Create Procfile**
   ```bash
   echo "web: node server.js" > Procfile
   ```

6. **Deploy**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git push heroku main
   ```

7. **Open your app**
   ```bash
   heroku open
   ```

---

## DigitalOcean Deployment

### Using App Platform

1. **Create account** at digitalocean.com

2. **Create new App**
   - Connect your GitHub/GitLab repository
   - Or upload your code

3. **Configure Environment Variables**
   ```
   MONGODB_URI=mongodb+srv://...
   JWT_SECRET=your-secret-key
   NODE_ENV=production
   PORT=8080
   ```

4. **Configure Build Command**
   ```bash
   npm install
   ```

5. **Configure Run Command**
   ```bash
   npm start
   ```

6. **Add MongoDB Database**
   - Use DigitalOcean Managed Database
   - Or MongoDB Atlas

7. **Deploy**
   - Click "Deploy"
   - Wait for build to complete

### Using Droplet (VPS)

1. **Create Ubuntu Droplet**

2. **SSH into server**
   ```bash
   ssh root@your-server-ip
   ```

3. **Install Node.js**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

4. **Install MongoDB**
   ```bash
   wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
   echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
   sudo apt-get update
   sudo apt-get install -y mongodb-org
   sudo systemctl start mongod
   sudo systemctl enable mongod
   ```

5. **Install PM2**
   ```bash
   sudo npm install -g pm2
   ```

6. **Clone your repository**
   ```bash
   git clone https://github.com/yourusername/task-manager-app.git
   cd task-manager-app
   ```

7. **Install dependencies**
   ```bash
   npm install
   ```

8. **Create .env file**
   ```bash
   nano .env
   ```
   
   Add:
   ```
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/taskmanager
   JWT_SECRET=your-production-secret
   NODE_ENV=production
   ```

9. **Start with PM2**
   ```bash
   pm2 start server.js --name taskflow
   pm2 save
   pm2 startup
   ```

10. **Set up Nginx (optional)**
    ```bash
    sudo apt-get install nginx
    sudo nano /etc/nginx/sites-available/taskflow
    ```
    
    Add:
    ```nginx
    server {
        listen 80;
        server_name your-domain.com;

        location / {
            proxy_pass http://localhost:3000;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_cache_bypass $http_upgrade;
        }
    }
    ```
    
    Enable:
    ```bash
    sudo ln -s /etc/nginx/sites-available/taskflow /etc/nginx/sites-enabled/
    sudo nginx -t
    sudo systemctl restart nginx
    ```

11. **Set up SSL with Let's Encrypt**
    ```bash
    sudo apt-get install certbot python3-certbot-nginx
    sudo certbot --nginx -d your-domain.com
    ```

---

## AWS Deployment

### Using Elastic Beanstalk

1. **Install EB CLI**
   ```bash
   pip install awsebcli
   ```

2. **Initialize EB**
   ```bash
   eb init
   ```

3. **Create environment**
   ```bash
   eb create taskflow-env
   ```

4. **Set environment variables**
   ```bash
   eb setenv MONGODB_URI="mongodb+srv://..." JWT_SECRET="your-secret" NODE_ENV="production"
   ```

5. **Deploy**
   ```bash
   eb deploy
   ```

6. **Open app**
   ```bash
   eb open
   ```

---

## Production Checklist

### Security
- [ ] Change JWT_SECRET to a strong, random string
- [ ] Use environment variables for all sensitive data
- [ ] Enable HTTPS/SSL
- [ ] Set up rate limiting
- [ ] Implement CORS properly (restrict origins)
- [ ] Add helmet security headers
- [ ] Sanitize user inputs
- [ ] Use strong MongoDB passwords
- [ ] Enable MongoDB authentication

### Performance
- [ ] Enable compression
- [ ] Set up CDN for static files
- [ ] Add database indexes
- [ ] Implement caching (Redis)
- [ ] Monitor with PM2 or similar
- [ ] Set up log rotation
- [ ] Optimize MongoDB queries

### Monitoring
- [ ] Set up error logging (e.g., Sentry)
- [ ] Monitor server health
- [ ] Set up uptime monitoring
- [ ] Track performance metrics
- [ ] Set up alerts for errors

### Backup
- [ ] Automated database backups
- [ ] Store backups in different location
- [ ] Test restore procedures
- [ ] Document backup strategy

### Environment Variables (Production)

Create a production `.env`:

```env
# Server
PORT=3000
NODE_ENV=production

# Database
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/taskmanager?retryWrites=true&w=majority

# Security
JWT_SECRET=your-very-long-random-secret-key-generate-new-one

# CORS (comma-separated)
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com

# Optional
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Additional Production Recommendations

1. **Use MongoDB Atlas** for managed database
2. **Implement rate limiting** to prevent abuse
3. **Add logging service** (Winston, Morgan)
4. **Set up monitoring** (New Relic, DataDog)
5. **Use CDN** for static assets (Cloudflare, CloudFront)
6. **Implement CI/CD** (GitHub Actions, Jenkins)
7. **Add automated tests** before deployment
8. **Set up staging environment** for testing
9. **Document your deployment process**
10. **Create backup and disaster recovery plan**

---

## Updating Your Deployment

### Heroku
```bash
git add .
git commit -m "Update message"
git push heroku main
```

### DigitalOcean Droplet
```bash
ssh root@your-server-ip
cd task-manager-app
git pull
npm install
pm2 restart taskflow
```

### DigitalOcean App Platform
- Push to connected repository
- Auto-deploys on push

---

## Troubleshooting Production Issues

### Check Logs

**Heroku:**
```bash
heroku logs --tail
```

**PM2:**
```bash
pm2 logs taskflow
```

### Common Issues

1. **Database connection errors**
   - Verify MongoDB URI is correct
   - Check network access/IP whitelist
   - Ensure database user has correct permissions

2. **Environment variables not set**
   - Double-check all required vars are set
   - Restart the application after setting vars

3. **Port binding issues**
   - Use PORT from environment variable
   - Most platforms require specific ports

4. **Static files not loading**
   - Verify public directory structure
   - Check Express static middleware setup

---

## Support

For deployment issues:
- Check platform-specific documentation
- Review application logs
- Test locally first
- Use staging environment before production

Good luck with your deployment! 🚀
