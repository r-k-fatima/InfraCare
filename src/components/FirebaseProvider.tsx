import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { collection, onSnapshot, query, addDoc, updateDoc, deleteDoc, doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { Issue, Worker, Assignment } from '../types';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

interface FirebaseContextType {
  user: User | null;
  loading: boolean;
  issues: Issue[];
  workers: Worker[];
  assignments: Assignment[];
  addWorker: (name: string) => Promise<void>;
  assignTask: (workerId: string, issueId: string) => Promise<void>;
  completeTask: (assignmentId: string) => Promise<void>;
}

const FirebaseContext = createContext<FirebaseContextType | undefined>(undefined);

export const FirebaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  // Sync Issues
  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, 'issues'));
    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Issue));
        setIssues(data);
      },
      (error) => handleFirestoreError(error, OperationType.GET, 'issues')
    );
    return unsubscribe;
  }, [user]);

  // Sync Workers
  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, 'workers'));
    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Worker));
        setWorkers(data);
      },
      (error) => handleFirestoreError(error, OperationType.GET, 'workers')
    );
    return unsubscribe;
  }, [user]);

  // Sync Assignments
  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, 'assignments'));
    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Assignment));
        setAssignments(data);
      },
      (error) => handleFirestoreError(error, OperationType.GET, 'assignments')
    );
    return unsubscribe;
  }, [user]);

  const addWorker = async (name: string) => {
    const path = 'workers';
    try {
      await addDoc(collection(db, path), {
        name,
        isAvailable: true
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
    }
  };

  const assignTask = async (workerId: string, issueId: string) => {
    const asgnPath = 'assignments';
    const workerPath = `workers/${workerId}`;
    const issuePath = `issues/${issueId}`;
    try {
      // 1. Create Assignment
      await addDoc(collection(db, asgnPath), {
        workerId,
        issueId,
        assignedAt: new Date().toISOString()
      });
      // 2. Update Worker
      await updateDoc(doc(db, 'workers', workerId), { isAvailable: false });
      // 3. Update Issue
      await updateDoc(doc(db, 'issues', issueId), { status: 'in-progress' });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'multi-write-atomic');
    }
  };

  const completeTask = async (assignmentId: string) => {
    const asgn = assignments.find(a => a.id === assignmentId);
    if (!asgn) return;
    try {
      // 1. Release Worker
      await updateDoc(doc(db, 'workers', asgn.workerId), { isAvailable: true });
      // 2. Resolve Issue
      await updateDoc(doc(db, 'issues', asgn.issueId), { status: 'resolved' });
      // 3. Delete Assignment
      await deleteDoc(doc(db, 'assignments', assignmentId));
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'complete-task');
    }
  };

  return (
    <FirebaseContext.Provider value={{ 
      user, loading, issues, workers, assignments, 
      addWorker, assignTask, completeTask 
    }}>
      {children}
    </FirebaseContext.Provider>
  );
};

export const useFirebase = () => {
  const context = useContext(FirebaseContext);
  if (context === undefined) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }
  return context;
};
