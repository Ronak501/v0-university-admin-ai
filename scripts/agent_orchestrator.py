"""
LangGraph Agent Orchestrator for University Administration
Handles intelligent planning, execution, and validation of student requests
"""

from typing import Optional, Any
from enum import Enum
import json
from datetime import datetime
from langgraph.graph import StateGraph, START, END
from langgraph.types import StreamWriter
from pydantic import BaseModel

# ============================================================================
# 1. TYPES & CONFIGURATION
# ============================================================================

class IntentType(str, Enum):
    FEE_ISSUE = "fee_issue"
    COURSE_REGISTRATION = "course_registration"
    DOCUMENT_REQUEST = "document_request"
    EXAM_SCHEDULING = "exam_scheduling"
    STUDENT_GRIEVANCE = "student_grievance"
    GENERAL_INQUIRY = "general_inquiry"

class AgentStatus(str, Enum):
    PENDING = "pending"
    EXECUTING = "executing"
    SUCCESS = "success"
    FAILED = "failed"

class OrchestratorState(BaseModel):
    """State passed through the agent graph"""
    request_id: str
    user_id: str
    intent: IntentType
    title: str
    description: str
    priority: str = "medium"
    
    # Execution tracking
    plan: Optional[dict] = None
    actions: list[dict] = []
    validation_result: Optional[dict] = None
    escalation_required: bool = False
    escalation_reason: Optional[str] = None
    
    # Metadata
    created_at: str = None
    updated_at: str = None
    
    def __init__(self, **data):
        super().__init__(**data)
        if not self.created_at:
            self.created_at = datetime.utcnow().isoformat()
        self.updated_at = datetime.utcnow().isoformat()

# ============================================================================
# 2. INTAKE AGENT
# ============================================================================

class IntakeAgent:
    """
    Classifies user intent and extracts key information
    """
    
    def classify_intent(self, description: str) -> IntentType:
        """Classify request type based on description"""
        keywords = {
            IntentType.FEE_ISSUE: ["fee", "receipt", "payment", "refund", "bill"],
            IntentType.COURSE_REGISTRATION: ["course", "register", "add", "drop", "enrollment"],
            IntentType.DOCUMENT_REQUEST: ["certificate", "transcript", "document", "letter"],
            IntentType.EXAM_SCHEDULING: ["exam", "schedule", "date", "time", "conflict"],
            IntentType.STUDENT_GRIEVANCE: ["grievance", "complaint", "unfair", "issue"],
            IntentType.GENERAL_INQUIRY: ["question", "information", "inquiry"],
        }
        
        description_lower = description.lower()
        
        for intent, words in keywords.items():
            if any(word in description_lower for word in words):
                return intent
        
        return IntentType.GENERAL_INQUIRY
    
    def process(self, state: OrchestratorState) -> OrchestratorState:
        """Process intake"""
        state.intent = self.classify_intent(state.description)
        state.updated_at = datetime.utcnow().isoformat()
        print(f"[Intake] Classified intent: {state.intent.value}")
        return state

# ============================================================================
# 3. PLANNER AGENT
# ============================================================================

class PlannerAgent:
    """
    Creates execution plan based on intent and policy rules
    """
    
    def create_plan(self, state: OrchestratorState) -> dict:
        """Generate execution steps"""
        base_steps = {
            IntentType.FEE_ISSUE: [
                {"agent": "erp_rpa", "action": "fetch_payment_record", "params": {"student_id": state.user_id}},
                {"agent": "document", "action": "generate_receipt", "params": {"request_id": state.request_id}},
                {"agent": "document", "action": "encrypt_and_route", "params": {"send_email": True}},
            ],
            IntentType.COURSE_REGISTRATION: [
                {"agent": "policy", "action": "validate_registration_eligibility", "params": {"student_id": state.user_id}},
                {"agent": "erp_rpa", "action": "update_course_enrollment", "params": {"request_id": state.request_id}},
                {"agent": "document", "action": "generate_enrollment_letter", "params": {"request_id": state.request_id}},
            ],
            IntentType.DOCUMENT_REQUEST: [
                {"agent": "erp_rpa", "action": "retrieve_document", "params": {"student_id": state.user_id, "doc_type": state.title}},
                {"agent": "document", "action": "encrypt_and_route", "params": {"send_email": True}},
            ],
            IntentType.EXAM_SCHEDULING: [
                {"agent": "policy", "action": "validate_exam_conflict", "params": {"student_id": state.user_id}},
                {"agent": "erp_rpa", "action": "update_exam_schedule", "params": {"request_id": state.request_id}},
            ],
            IntentType.STUDENT_GRIEVANCE: [
                {"agent": "escalation", "action": "escalate_to_human", "params": {"reason": "Student grievance requires human review"}},
            ],
        }
        
        steps = base_steps.get(state.intent, [
            {"agent": "escalation", "action": "escalate_to_human", "params": {"reason": "Unknown intent"}}
        ])
        
        return {
            "request_id": state.request_id,
            "steps": steps,
            "requires_human_approval": state.intent == IntentType.STUDENT_GRIEVANCE,
            "estimated_time_minutes": len(steps) * 2,
        }
    
    def process(self, state: OrchestratorState) -> OrchestratorState:
        """Create execution plan"""
        state.plan = self.create_plan(state)
        state.updated_at = datetime.utcnow().isoformat()
        print(f"[Planner] Created plan with {len(state.plan['steps'])} steps")
        return state

# ============================================================================
# 4. POLICY VALIDATOR
# ============================================================================

class PolicyValidator:
    """
    Validates actions against university policies
    """
    
    def validate(self, state: OrchestratorState) -> bool:
        """Check policy compliance"""
        rules = {
            IntentType.FEE_ISSUE: self._validate_fee_policy,
            IntentType.COURSE_REGISTRATION: self._validate_registration_policy,
            IntentType.DOCUMENT_REQUEST: self._validate_document_policy,
            IntentType.EXAM_SCHEDULING: self._validate_exam_policy,
        }
        
        validator = rules.get(state.intent)
        if validator:
            return validator(state)
        return True
    
    def _validate_fee_policy(self, state: OrchestratorState) -> bool:
        """Fee issue policy: Student must have valid ID"""
        return bool(state.user_id)
    
    def _validate_registration_policy(self, state: OrchestratorState) -> bool:
        """Registration policy: Max 24 credits per semester"""
        return True  # Mock validation
    
    def _validate_document_policy(self, state: OrchestratorState) -> bool:
        """Document policy: Student can request own documents"""
        return True  # Mock validation
    
    def _validate_exam_policy(self, state: OrchestratorState) -> bool:
        """Exam policy: 2-hour minimum between exams"""
        return True  # Mock validation
    
    def process(self, state: OrchestratorState) -> OrchestratorState:
        """Validate against policies"""
        compliant = self.validate(state)
        state.validation_result = {
            "compliant": compliant,
            "violations": [] if compliant else ["Policy violation detected"],
        }
        
        if not compliant:
            state.escalation_required = True
            state.escalation_reason = "Policy violation"
        
        state.updated_at = datetime.utcnow().isoformat()
        print(f"[Policy] Validation: {'PASSED' if compliant else 'FAILED'}")
        return state

# ============================================================================
# 5. ERP RPA EXECUTOR
# ============================================================================

class ERPRPAAgent:
    """
    Interacts with legacy ERP systems via RPA
    """
    
    async def execute_erp_action(self, action: dict) -> dict:
        """Execute RPA action against ERP"""
        action_type = action.get("action")
        params = action.get("params", {})
        
        # Simulate RPA execution
        results = {
            "fetch_payment_record": {"status": "success", "data": {"amount": 50000, "date": "2025-12-15"}},
            "generate_receipt": {"status": "success", "file_path": "/documents/receipt_123.pdf"},
            "retrieve_document": {"status": "success", "file_path": "/documents/transcript_abc.pdf"},
            "update_course_enrollment": {"status": "success", "enrolled_courses": 4},
            "update_exam_schedule": {"status": "success", "new_slot": "2026-01-20 10:00"},
        }
        
        return results.get(action_type, {"status": "failed", "error": "Unknown action"})
    
    def process(self, state: OrchestratorState) -> OrchestratorState:
        """Execute ERP actions"""
        import asyncio
        
        if state.plan:
            for step in state.plan.get("steps", []):
                if step.get("agent") == "erp_rpa":
                    result = asyncio.run(self.execute_erp_action(step))
                    state.actions.append({
                        "step": step,
                        "result": result,
                        "timestamp": datetime.utcnow().isoformat(),
                    })
                    print(f"[ERP RPA] Executed: {step['action']} -> {result['status']}")
        
        state.updated_at = datetime.utcnow().isoformat()
        return state

# ============================================================================
# 6. VALIDATOR AGENT
# ============================================================================

class ValidatorAgent:
    """
    Verifies outcomes and self-corrects errors
    """
    
    def validate_outcome(self, state: OrchestratorState) -> dict:
        """Verify all actions succeeded"""
        all_success = all(
            action.get("result", {}).get("status") == "success"
            for action in state.actions
        )
        
        return {
            "valid": all_success,
            "failed_actions": [
                action for action in state.actions
                if action.get("result", {}).get("status") != "success"
            ],
        }
    
    def process(self, state: OrchestratorState) -> OrchestratorState:
        """Validate and correct"""
        validation = self.validate_outcome(state)
        
        if not validation["valid"]:
            state.escalation_required = True
            state.escalation_reason = f"Validation failed: {len(validation['failed_actions'])} actions failed"
        
        state.updated_at = datetime.utcnow().isoformat()
        print(f"[Validator] Outcome validation: {'PASSED' if validation['valid'] else 'FAILED'}")
        return state

# ============================================================================
# 7. ESCALATION AGENT
# ============================================================================

class EscalationAgent:
    """
    Routes cases to humans when needed
    """
    
    def process(self, state: OrchestratorState) -> OrchestratorState:
        """Escalate to human if needed"""
        if state.escalation_required:
            print(f"[Escalation] Case escalated: {state.escalation_reason}")
        else:
            print(f"[Escalation] No escalation needed")
        
        state.updated_at = datetime.utcnow().isoformat()
        return state

# ============================================================================
# 8. LANGGRAPH ORCHESTRATOR
# ============================================================================

class UniversityAdminOrchestrator:
    """
    Main LangGraph-based orchestrator
    """
    
    def __init__(self):
        self.intake = IntakeAgent()
        self.planner = PlannerAgent()
        self.policy = PolicyValidator()
        self.erp = ERPRPAAgent()
        self.validator = ValidatorAgent()
        self.escalation = EscalationAgent()
        
        # Build graph
        self.graph = self._build_graph()
    
    def _build_graph(self) -> StateGraph:
        """Build LangGraph state machine"""
        graph = StateGraph(OrchestratorState)
        
        # Add nodes
        graph.add_node("intake", lambda state: self.intake.process(state))
        graph.add_node("planner", lambda state: self.planner.process(state))
        graph.add_node("policy", lambda state: self.policy.process(state))
        graph.add_node("erp_executor", lambda state: self.erp.process(state))
        graph.add_node("validator", lambda state: self.validator.process(state))
        graph.add_node("escalation", lambda state: self.escalation.process(state))
        
        # Add edges
        graph.add_edge(START, "intake")
        graph.add_edge("intake", "planner")
        graph.add_edge("planner", "policy")
        graph.add_edge("policy", "erp_executor")
        graph.add_edge("erp_executor", "validator")
        graph.add_edge("validator", "escalation")
        graph.add_edge("escalation", END)
        
        return graph.compile()
    
    async def process_request(self, state: OrchestratorState) -> OrchestratorState:
        """
        Process a student request end-to-end
        Returns final state with all actions and results
        """
        print(f"\n{'='*60}")
        print(f"[Orchestrator] Processing request: {state.request_id}")
        print(f"{'='*60}\n")
        
        # Run graph
        final_state = await self.graph.ainvoke({"state": state})
        
        print(f"\n{'='*60}")
        print(f"[Orchestrator] Request {state.request_id} complete")
        print(f"Escalation Required: {final_state.get('escalation_required', False)}")
        print(f"{'='*60}\n")
        
        return final_state

# ============================================================================
# 9. EXAMPLE USAGE
# ============================================================================

async def main():
    """Example: Process a fee issue request"""
    orchestrator = UniversityAdminOrchestrator()
    
    # Create a sample request
    state = OrchestratorState(
        request_id="REQ001",
        user_id="STU2023CS101",
        intent=IntentType.FEE_ISSUE,
        title="Missing Fee Receipt",
        description="I paid my semester 5 fees but didn't receive the receipt. Can you generate it?",
        priority="high",
    )
    
    # Process the request
    result = await orchestrator.process_request(state)
    
    # Output result
    print("\nFinal Result:")
    print(json.dumps(result.dict(), indent=2, default=str))

if __name__ == "__main__":
    import asyncio
    asyncio.run(main())
