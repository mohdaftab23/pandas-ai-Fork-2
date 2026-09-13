import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { ChatQueryView } from './components/ChatQueryView';
import { DataExplorerView } from './components/DataExplorerView';
import { SchemaView } from './components/SchemaView';
import { UploadModal } from './components/UploadModal';
import { DatasetSummary, ChatMessage, QueryResult } from './types';
import { AlertCircle, RefreshCw } from 'lucide-react';

export default function App() {
  const [datasets, setDatasets] = useState<{ id: string; name: string; rowCount: number; columnCount: number }[]>([]);
  const [currentDatasetId, setCurrentDatasetId] = useState<string>('heart');
  const [currentDataset, setCurrentDataset] = useState<DatasetSummary | null>(null);
  const [activeTab, setActiveTab] = useState<'chat' | 'table' | 'schema'>('chat');
  const [messagesByDataset, setMessagesByDataset] = useState<Record<string, ChatMessage[]>>({});
  const [isLoadingQuery, setIsLoadingQuery] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [hasGeminiKey, setHasGeminiKey] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Initial load
  useEffect(() => {
    const init = async () => {
      try {
        setInitialLoading(true);
        // Check health
        const healthRes = await fetch('/api/health');
        if (healthRes.ok) {
          const healthData = await healthRes.json();
          setHasGeminiKey(Boolean(healthData.hasGeminiKey));
        }

        // Fetch datasets
        const dsRes = await fetch('/api/datasets');
        if (dsRes.ok) {
          const dsList = await dsRes.json();
          setDatasets(dsList);
          if (dsList.length > 0) {
            const firstId = dsList[0].id;
            setCurrentDatasetId(firstId);
            await loadDataset(firstId);
          }
        }
      } catch (err: any) {
        console.error('Initialization failed:', err);
        setErrorMsg('Failed to connect to backend server. Retrying...');
      } finally {
        setInitialLoading(false);
      }
    };

    init();
  }, []);

  const loadDataset = async (id: string) => {
    try {
      setErrorMsg(null);
      const res = await fetch(`/api/datasets/${id}`);
      if (res.ok) {
        const data: DatasetSummary = await res.json();
        setCurrentDataset(data);
      } else {
        setErrorMsg('Failed to load dataset metadata');
      }
    } catch (err: any) {
      console.error('Failed to load dataset:', err);
      setErrorMsg('Error loading dataset');
    }
  };

  const handleSelectDataset = (id: string) => {
    setCurrentDatasetId(id);
    loadDataset(id);
  };

  const handleSendQuery = async (queryText: string) => {
    if (!currentDataset) return;

    const userMessage: ChatMessage = {
      id: 'msg_' + Date.now().toString(36) + '_u',
      role: 'user',
      content: queryText,
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessagesByDataset((prev) => ({
      ...prev,
      [currentDataset.id]: [...(prev[currentDataset.id] || []), userMessage],
    }));

    setIsLoadingQuery(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          datasetId: currentDataset.id,
          query: queryText,
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Query processing failed');
      }

      const result: QueryResult = await res.json();

      const assistantMessage: ChatMessage = {
        id: 'msg_' + Date.now().toString(36) + '_a',
        role: 'assistant',
        content: result.answer,
        timestamp: result.timestamp || new Date().toLocaleTimeString(),
        result,
      };

      setMessagesByDataset((prev) => ({
        ...prev,
        [currentDataset.id]: [...(prev[currentDataset.id] || []), assistantMessage],
      }));
    } catch (err: any) {
      const errorMessage: ChatMessage = {
        id: 'msg_' + Date.now().toString(36) + '_err',
        role: 'assistant',
        content: `Error: ${err.message || 'Unable to process query at this time.'}`,
        timestamp: new Date().toLocaleTimeString(),
      };

      setMessagesByDataset((prev) => ({
        ...prev,
        [currentDataset.id]: [...(prev[currentDataset.id] || []), errorMessage],
      }));
    } finally {
      setIsLoadingQuery(false);
    }
  };

  const handleUploadSuccess = async (newDatasetId: string) => {
    const dsRes = await fetch('/api/datasets');
    if (dsRes.ok) {
      const dsList = await dsRes.json();
      setDatasets(dsList);
      setCurrentDatasetId(newDatasetId);
      await loadDataset(newDatasetId);
      setActiveTab('chat');
    }
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-2xl flex items-center justify-center mx-auto animate-pulse">
            🐼
          </div>
          <h2 className="text-sm font-semibold text-stone-800">Starting PandasAI Studio...</h2>
          <p className="text-xs text-stone-500">Initializing dataset repositories and analytics engines</p>
        </div>
      </div>
    );
  }

  const currentMessages = (currentDataset ? messagesByDataset[currentDataset.id] : []) || [];

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 flex flex-col selection:bg-amber-500 selection:text-white">
      {/* Navbar */}
      <Navbar
        datasets={datasets}
        currentDatasetId={currentDatasetId}
        onSelectDataset={handleSelectDataset}
        onOpenUpload={() => setIsUploadOpen(true)}
        activeTab={activeTab}
        onChangeTab={setActiveTab}
        hasGeminiKey={hasGeminiKey}
      />

      {errorMsg && (
        <div className="max-w-7xl mx-auto w-full px-4 pt-3">
          <div className="p-3 bg-amber-50 border border-amber-200 text-amber-900 rounded-xl text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600" />
              <span>{errorMsg}</span>
            </div>
            <button
              onClick={() => loadDataset(currentDatasetId)}
              className="px-2 py-1 bg-amber-200/70 hover:bg-amber-300 rounded font-medium cursor-pointer"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1">
        {currentDataset ? (
          <>
            {activeTab === 'chat' && (
              <ChatQueryView
                dataset={currentDataset}
                messages={currentMessages}
                isLoading={isLoadingQuery}
                onSendQuery={handleSendQuery}
              />
            )}
            {activeTab === 'table' && <DataExplorerView dataset={currentDataset} />}
            {activeTab === 'schema' && <SchemaView dataset={currentDataset} />}
          </>
        ) : (
          <div className="h-96 flex items-center justify-center text-stone-400 text-xs">
            No dataset currently selected
          </div>
        )}
      </main>

      {/* Upload CSV Modal */}
      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onSuccess={handleUploadSuccess}
      />
    </div>
  );
}
