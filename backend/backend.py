from flask import Flask, request, jsonify,send_from_directory,url_for
from flask_pymongo import PyMongo
from flask_jwt_extended import JWTManager, jwt_required, get_jwt_identity
from flask_cors import CORS
import datetime
from flask_mail import Mail, Message
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token
from werkzeug.utils import secure_filename
import os
from bson import ObjectId
import logging




app = Flask(__name__)



# MongoDB setup
app.config["MONGO_URI"] = "mongodb://localhost:27017/Recruitment"
mongo = PyMongo(app)

# JWT setup
app.config['JWT_SECRET_KEY'] = 'd0cc4bc73fdd95416dde10f8b8b6ed183c390631a8678ebf1e4341e325d4a3b2'
jwt = JWTManager(app)

# Enable CORS
CORS(app, resources={r"/api/*": {"origins": "*"}})




UPLOAD_FOLDER = os.path.join(os.getcwd(), 'uploads')
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

app.config['MAIL_SERVER'] = 'smtp-mail.outlook.com'  # Your SMTP server
app.config['MAIL_PORT'] = 587  # Port for TLS
app.config['MAIL_USERNAME'] = 'rathoresawan34@outlook.com'  # Your email address
app.config['MAIL_PASSWORD'] = 'Ishika@1803'  # Your email password or app password
app.config['MAIL_USE_TLS'] = True  # Use TLS
app.config['MAIL_DEFAULT_SENDER'] = 'TalenAcquisition@outlook.com'

mail = Mail(app)

# Set up logging
logging.basicConfig(level=logging.DEBUG)

@app.route('/api/send-schedule-email', methods=['POST'])
@jwt_required()
def send_schedule_email():
    try:
        data = request.json
        logging.debug(f"Received data: {data}")
        to_email = data.get('email')
        schedule = data.get('schedule')

        if not to_email or not schedule:
            return jsonify({"msg": "Email and schedule are required!"}), 400

        # Create email content
        schedule_content = schedule if schedule != '[]' else "No specific schedule provided."
        email_body = f"""
        <html>
        <body>
            <div style="text-align: left;">
                <img src="{url_for('static', filename='images/logo.png', _external=True)}" alt="Company Logo" style="width: 150px; height: auto;">
            </div>
            <div style="text-align: center;">
                <img src="{url_for('static', filename='images/high3.png', _external=True)}" alt="Company Banner" style="width: 100%; height: auto;">
            </div>
            <p>Dear Candidate,</p>
            <p>Congratulations! We are pleased to inform you that you have been selected for an interview.</p>
            <p>Here are the details of your interview schedule:</p>
            <p>{schedule_content}</p>
            <p>Please be prepared and check your schedule.</p>
            <p>Best regards,<br>Recruitment Team</p>
            <div style="text-align: left; margin-top: 20px;">
                <p>HR<br>
                Lead-Talent Acquisition - Digital Solutions<br>
                <a href="mailto:demo@compunneldigital.com">demo@compunneldigital.com</a><br>
                +91-1203238800 ext. 234</p>
                <p>103 Morgan Lane, Ste. 102 Plainsboro, NJ 08536, USA.</p>
                <img src="{url_for('static', filename='banner.jpg', _external=True)}" alt="Company Image" style="width: 150px; height: auto;">
                <br>
                <a href="http://www.compunnel.com">www.compunnel.com</a>
            </div>
        </body>
        </html>
        """

        # Set up the email
        msg = Message(
            "Congratulations! Interview Scheduled",
            sender=app.config['MAIL_USERNAME'],
            recipients=[to_email]
        )
        msg.html = email_body

        # Send the email
        mail.send(msg)
        logging.info(f"Email sent to {to_email}")

        return jsonify({"msg": "Email sent successfully!"}), 200
    except Exception as e:
        logging.error(f"Error sending email: {str(e)}")
        return jsonify({"msg": f"An error occurred: {str(e)}"}), 500
    
@app.route('/api/apply', methods=['POST'])
def apply():
    name = request.form.get('name')
    email = request.form.get('email')
    phone = request.form.get('phone')
    job_posting_id = request.form.get('job_posting_id')
    application_status = request.form.get('application_status')
    interview_schedule = request.form.get('interview_schedule')

    resume = request.files.get('resume')
    documents = request.files.getlist('documents')

    if not name or not email or not phone or not job_posting_id:
        return jsonify({"msg": "Missing required fields"}), 400

    resume_path = None
    if resume:
        resume_filename = secure_filename(resume.filename)
        resume_path = os.path.join(app.config['UPLOAD_FOLDER'], resume_filename)
        resume.save(resume_path)

    document_paths = []
    for doc in documents:
        doc_filename = secure_filename(doc.filename)
        doc_path = os.path.join(app.config['UPLOAD_FOLDER'], doc_filename)
        doc.save(doc_path)
        document_paths.append(doc_path)

    application = {
        "name": name,
        "email": email,
        "phone": phone,
        "resume": resume_path,
        "documents": document_paths,
        "job_posting_id": job_posting_id,
        "application_status": application_status,
        "interview_schedule": interview_schedule
    }

    try:
        mongo.db.applications.insert_one(application)
        return jsonify({"msg": "Application submitted successfully"}), 201
    except Exception as e:
        return jsonify({"msg": f"An error occurred: {str(e)}"}), 500


@app.route('/api/job-postings', methods=['POST'])
@jwt_required()
def create_job_posting():
    data = request.get_json()
    title = data.get('title')
    department = data.get('department')
    location = data.get('location')
    job_type = data.get('jobType')
    description = data.get('description')
    application_deadline = data.get('application_deadline')
    visibility_status = data.get('visibility_status')

    if not title or not department or not location or not job_type or not description or not application_deadline:
        return jsonify({"msg": "Missing required fields"}), 400

    try:
        job_posting = {
            "title": title,
            "department": department,
            "location": location,
            "job_type": job_type,
            "description": description,
            "application_deadline": datetime.datetime.strptime(application_deadline, '%Y-%m-%d'),
            "visibility_status": visibility_status
        }
        
        job_id = mongo.db.jobformdata.insert_one(job_posting).inserted_id
        return jsonify({"msg": "Job posting created successfully", "job_id": str(job_id)}), 201
    except Exception as e:
        return jsonify({"msg": f"An error occurred: {str(e)}"}), 500


@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    email = data.get('email')
    role = data.get('role')

    if not username or not password or not email or not role:
        return jsonify({"msg": "Missing data"}), 400

    if mongo.db.users.find_one({"email": email}):
        return jsonify({"msg": "User already exists"}), 400

    hashed_password = generate_password_hash(password)
    user_id = mongo.db.users.insert_one({
        "username": username,
        "password": hashed_password,
        "email": email,
        "role": role,
        "created_at": datetime.datetime.utcnow()
    }).inserted_id

    return jsonify({"msg": "User registered successfully", "user_id": str(user_id)}), 201

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    user = mongo.db.users.find_one({"email": email})
    if not user or not check_password_hash(user['password'], password):
        return jsonify({"msg": "Invalid credentials"}), 401

    access_token = create_access_token(identity={
        "username": user['username'],
        "email": user['email'],
        "role": user['role']
    })

    return jsonify({"token": access_token}), 200

def role_required(required_role):
    def decorator(fn):
        @jwt_required()
        def wrapper(*args, **kwargs):
            claims = get_jwt_identity()
            if claims['role'] != required_role:
                return jsonify({"msg": "Permission denied"}), 403
            return fn(*args, **kwargs)
        return wrapper
    return decorator

@app.route('/api/job', methods=['POST'])
@role_required('HR Manager')
def create_job():
    data = request.get_json()
    job_id = mongo.db.jobs.insert_one(data).inserted_id
    return jsonify({"msg": "Job posted successfully", "job_id": str(job_id)}), 201

@app.route('/api/candidates', methods=['GET'])
@jwt_required()
def view_candidates():
    claims = get_jwt_identity()
    if claims['role'] not in ['HR Manager', 'Recruiter']:
        return jsonify({"msg": "Permission denied"}), 403
    candidates = list(mongo.db.candidates.find())
    return jsonify(candidates), 200

@app.route('/api/user', methods=['GET'])
@jwt_required()
def get_user():
    claims = get_jwt_identity()
    user = mongo.db.users.find_one({"email": claims['email']}, {"_id": 0, "password": 0})
    if user:
        return jsonify(user), 200
    return jsonify({"msg": "User not found"}), 404

@app.route('/api/job-postings', methods=['GET'])
def get_job_postings():
    try:
        jobs = list(mongo.db.jobformdata.find())
        for job in jobs:
            job['_id'] = str(job['_id'])  # Convert ObjectId to string
            job['application_deadline'] = job['application_deadline'].strftime('%Y-%m-%d')
        return jsonify(jobs), 200
    except Exception as e:
        return jsonify({"msg": f"An error occurred: {str(e)}"}), 500
    


# Update job posting
@app.route('/api/job-postings/<id>', methods=['PUT'])
@jwt_required()
def update_job_posting(id):
    try:
        data = request.get_json()
        title = data.get('title')
        department = data.get('department')
        location = data.get('location')
        job_type = data.get('jobType')
        description = data.get('description')
        application_deadline = data.get('application_deadline')
        visibility_status = data.get('visibility_status')

        update_fields = {}
        if title:
            update_fields['title'] = title
        if department:
            update_fields['department'] = department
        if location:
            update_fields['location'] = location
        if job_type:
            update_fields['job_type'] = job_type
        if description:
            update_fields['description'] = description
        if application_deadline:
            update_fields['application_deadline'] = datetime.datetime.strptime(application_deadline, '%Y-%m-%d')
        if visibility_status is not None:
            update_fields['visibility_status'] = visibility_status

        result = mongo.db.jobformdata.update_one(
            {'_id': ObjectId(id)},
            {'$set': update_fields}
        )

        if result.matched_count == 0:
            return jsonify({"msg": "Job posting not found"}), 404

        return jsonify({"msg": "Job posting updated successfully"}), 200
    except Exception as e:
        return jsonify({"msg": f"An error occurred: {str(e)}"}), 500

# Delete job posting
@app.route('/api/job-postings/<id>', methods=['DELETE'])
@jwt_required()
def delete_job_posting(id):
    try:
        result = mongo.db.jobformdata.delete_one({'_id': ObjectId(id)})

        if result.deleted_count == 0:
            return jsonify({"msg": "Job posting not found"}), 404

        return jsonify({"msg": "Job posting deleted successfully"}), 200
    except Exception as e:
        return jsonify({"msg": f"An error occurred: {str(e)}"}), 500
    

@app.route('/api/applications', methods=['GET'])
@jwt_required()
def get_candidates():
    try:
        # Fetch all documents from the 'applications' collection
        candidates = list(mongo.db.applications.find())
        
        # Process the data for JSON serialization
        for candidate in candidates:
            candidate['_id'] = str(candidate['_id'])  # Convert ObjectId to string
            candidate['job_posting_id'] = str(candidate.get('job_posting_id', ''))  # Convert job_posting_id to string
            candidate['resume'] = candidate.get('resume', 'No Resume')
            candidate['documents'] = candidate.get('documents', [])
            candidate['application_status'] = candidate.get('application_status', 'Pending')
            candidate['interview_schedule'] = candidate.get('interview_schedule', '[]')

        return jsonify(candidates), 200

    except Exception as e:
        return jsonify({"msg": f"An error occurred: {str(e)}"}), 500


if __name__ == '__main__':
    app.run(debug=True, port=5001)
