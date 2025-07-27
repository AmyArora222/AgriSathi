# import os
# import asyncio
# import subprocess
# import threading
# import time
# import signal
# from livekit import api
# from flask import Flask, request, jsonify
# from dotenv import load_dotenv
# from flask_cors import CORS
# from livekit.api import LiveKitAPI, ListRoomsRequest
# import uuid
# import logging

# load_dotenv()

# # Configure logging
# logging.basicConfig(level=logging.INFO)
# logger = logging.getLogger(__name__)

# app = Flask(__name__)
# CORS(app, resources={r"/*": {"origins": "*"}})

# # Store running agent processes and their room assignments
# agent_processes = {}
# room_agent_map = {}

# def start_agent_worker():
#     """Start the LiveKit agent worker process"""
#     try:
#         # Start the agent using LiveKit CLI - this will handle room assignments automatically
#         cmd = ["python", "agent.py", "dev"]
        
#         # Set environment variables for the agent
#         env = os.environ.copy()
#         env.update({
#             'LIVEKIT_URL': os.getenv('LIVEKIT_URL'),
#             'LIVEKIT_API_KEY': os.getenv('LIVEKIT_API_KEY'),
#             'LIVEKIT_API_SECRET': os.getenv('LIVEKIT_API_SECRET'),
#         })
        
#         process = subprocess.Popen(
#             cmd,
#             stdout=subprocess.PIPE,
#             stderr=subprocess.PIPE,
#             text=True,
#             env=env,
#             preexec_fn=os.setsid if os.name != 'nt' else None  # For process group management
#         )
        
#         logger.info(f"Started LiveKit agent worker with PID: {process.pid}")
#         return process
        
#     except Exception as e:
#         logger.error(f"Error starting agent worker: {e}")
#         return None

# def ensure_agent_running():
#     """Ensure the agent worker is running"""
#     global agent_worker_process
    
#     if 'agent_worker_process' not in globals() or agent_worker_process is None or agent_worker_process.poll() is not None:
#         logger.info("Starting new agent worker...")
#         agent_worker_process = start_agent_worker()
#         if agent_worker_process:
#             # Give the agent a moment to start up
#             time.sleep(2)
#             return True
#         return False
#     return True

# async def generate_room_name():
#     """Generate a unique room name"""
#     name = "room-" + str(uuid.uuid4())[:8]
#     try:
#         rooms = await get_rooms()
#         while name in rooms:
#             name = "room-" + str(uuid.uuid4())[:8]
#     except:
#         pass  # If we can't check existing rooms, just use the generated name
#     return name

# async def get_rooms():
#     """Get list of active rooms"""
#     try:
#         lk_api = LiveKitAPI(
#             os.getenv("LIVEKIT_URL"),
#             os.getenv("LIVEKIT_API_KEY"),
#             os.getenv("LIVEKIT_API_SECRET")
#         )
#         rooms = await lk_api.room.list_rooms(ListRoomsRequest())
#         await lk_api.aclose()
#         return [room.name for room in rooms.rooms]
#     except Exception as e:
#         logger.error(f"Error fetching rooms: {e}")
#         return []

# @app.route("/api/getToken")
# def get_token():
#     """Generate token for LiveKit room access"""
#     try:
#         name = request.args.get("name", "user-" + str(uuid.uuid4())[:8])
#         room = request.args.get("room", None)
        
#         # Ensure agent worker is running
#         if not ensure_agent_running():
#             return jsonify({"error": "Agent service unavailable"}), 503
        
#         # Run async operations in event loop
#         loop = asyncio.new_event_loop()
#         asyncio.set_event_loop(loop)
        
#         try:
#             if not room:
#                 room = loop.run_until_complete(generate_room_name())
            
#             # Create access token with proper permissions
#             token = api.AccessToken(
#                 os.getenv("LIVEKIT_API_KEY"), 
#                 os.getenv("LIVEKIT_API_SECRET")
#             ).with_identity(name)\
#              .with_name(name)\
#              .with_grants(api.VideoGrants(
#                 room_join=True,
#                 room=room,
#                 can_publish=True,
#                 can_subscribe=True,
#                 can_publish_data=True,
#                 can_update_own_metadata=True
#             ))
            
#             logger.info(f"Generated token for user '{name}' in room '{room}'")
#             return token.to_jwt()
            
#         finally:
#             loop.close()
            
#     except Exception as e:
#         logger.error(f"Error generating token: {e}")
#         return jsonify({"error": str(e)}), 500

# @app.route("/api/rooms")
# def list_rooms():
#     """List all active rooms"""
#     try:
#         loop = asyncio.new_event_loop()
#         asyncio.set_event_loop(loop)
        
#         try:
#             rooms = loop.run_until_complete(get_rooms())
#             return jsonify({"rooms": rooms})
#         finally:
#             loop.close()
            
#     except Exception as e:
#         logger.error(f"Error listing rooms: {e}")
#         return jsonify({"error": str(e)}), 500

# @app.route("/api/health")
# def health_check():
#     """Health check endpoint"""
#     agent_status = "running" if 'agent_worker_process' in globals() and agent_worker_process and agent_worker_process.poll() is None else "stopped"
    
#     return jsonify({
#         "status": "healthy",
#         "agent_worker": agent_status,
#         "livekit_url": os.getenv('LIVEKIT_URL'),
#         "timestamp": time.time()
#     })

# @app.route("/api/restart-agent", methods=["POST"])
# def restart_agent():
#     """Restart the agent worker"""
#     try:
#         global agent_worker_process
        
#         # Stop existing agent if running
#         if 'agent_worker_process' in globals() and agent_worker_process and agent_worker_process.poll() is None:
#             logger.info("Stopping existing agent worker...")
#             if os.name != 'nt':
#                 os.killpg(os.getpgid(agent_worker_process.pid), signal.SIGTERM)
#             else:
#                 agent_worker_process.terminate()
#             agent_worker_process.wait(timeout=10)
        
#         # Start new agent
#         agent_worker_process = start_agent_worker()
        
#         if agent_worker_process:
#             return jsonify({"status": "Agent restarted successfully"})
#         else:
#             return jsonify({"error": "Failed to restart agent"}), 500
            
#     except Exception as e:
#         logger.error(f"Error restarting agent: {e}")
#         return jsonify({"error": str(e)}), 500

# # Cleanup on shutdown
# def cleanup():
#     """Clean up processes on shutdown"""
#     try:
#         if 'agent_worker_process' in globals() and agent_worker_process and agent_worker_process.poll() is None:
#             logger.info("Cleaning up agent worker...")
#             if os.name != 'nt':
#                 os.killpg(os.getpgid(agent_worker_process.pid), signal.SIGTERM)
#             else:
#                 agent_worker_process.terminate()
#             agent_worker_process.wait(timeout=5)
#     except Exception as e:
#         logger.error(f"Error during cleanup: {e}")

# # Register cleanup function
# import atexit
# atexit.register(cleanup)

# if __name__ == "__main__":
#     print("Starting Agricultural Voice Assistant Server...")
#     print(f"LiveKit URL: {os.getenv('LIVEKIT_URL')}")
#     print(f"Agent will be started automatically on first connection")
    
#     # Validate environment variables
#     required_vars = ['LIVEKIT_URL', 'LIVEKIT_API_KEY', 'LIVEKIT_API_SECRET']
#     missing_vars = [var for var in required_vars if not os.getenv(var)]
    
#     if missing_vars:
#         logger.error(f"Missing required environment variables: {missing_vars}")
#         exit(1)
    
#     try:
#         app.run(host="0.0.0.0", port=5001, debug=True)
#     finally:
#         cleanup()