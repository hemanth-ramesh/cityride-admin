import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { SafetyService } from '@/services/safetyService';
import { SosAlert, IncidentReport, DriverMessage } from '@/types/safety';

export const SAFETY_KEYS = {
  sos: ['safety', 'sos'] as const,
  incidents: ['safety', 'incidents'] as const,
  messages: ['safety', 'messages'] as const,
};

export function useSafety() {
  const queryClient = useQueryClient();

  const sosQuery = useQuery({
    queryKey: SAFETY_KEYS.sos,
    queryFn: () => SafetyService.getSosAlerts(),
    refetchInterval: 4000, // Poll every 4 seconds for emergency alerts
  });

  const incidentsQuery = useQuery({
    queryKey: SAFETY_KEYS.incidents,
    queryFn: () => SafetyService.getIncidents(),
  });

  const messagesQuery = useQuery({
    queryKey: SAFETY_KEYS.messages,
    queryFn: () => SafetyService.getDriverMessages(),
  });

  // SOS Mutations
  const triggerSosMutation = useMutation({
    mutationFn: (alertData: Partial<SosAlert>) => SafetyService.triggerEmergencyDemo(alertData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SAFETY_KEYS.sos });
    },
  });

  const acknowledgeSosMutation = useMutation({
    mutationFn: ({ id, adminName }: { id: string; adminName: string }) =>
      SafetyService.acknowledgeSos(id, adminName),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SAFETY_KEYS.sos });
    },
  });

  const dispatchHelpMutation = useMutation({
    mutationFn: ({
      id,
      services,
    }: {
      id: string;
      services: ('POLICE' | 'AMBULANCE' | 'FIRE' | 'TOW_TRUCK' | 'DEPOT_CREW')[];
    }) => SafetyService.dispatchHelp(id, services),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SAFETY_KEYS.sos });
    },
  });

  const resolveSosMutation = useMutation({
    mutationFn: ({ id, adminName, notes }: { id: string; adminName: string; notes: string }) =>
      SafetyService.resolveSos(id, adminName, notes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SAFETY_KEYS.sos });
    },
  });

  // Incident Mutations
  const createIncidentMutation = useMutation({
    mutationFn: (data: Omit<IncidentReport, 'id' | 'incidentCode' | 'reportedAt'>) =>
      SafetyService.createIncident(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SAFETY_KEYS.incidents });
    },
  });

  const updateIncidentMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<IncidentReport> }) =>
      SafetyService.updateIncident(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SAFETY_KEYS.incidents });
    },
  });

  // Driver Messaging Mutation
  const sendMessageMutation = useMutation({
    mutationFn: (data: Omit<DriverMessage, 'id' | 'sentAt' | 'deliveryStatus'>) =>
      SafetyService.sendDriverMessage(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SAFETY_KEYS.messages });
    },
  });

  return {
    sosAlerts: sosQuery.data || [],
    incidents: incidentsQuery.data || [],
    driverMessages: messagesQuery.data || [],
    isLoadingSos: sosQuery.isLoading,
    isLoadingIncidents: incidentsQuery.isLoading,
    isLoadingMessages: messagesQuery.isLoading,
    triggerSos: triggerSosMutation.mutateAsync,
    acknowledgeSos: acknowledgeSosMutation.mutateAsync,
    dispatchHelp: dispatchHelpMutation.mutateAsync,
    resolveSos: resolveSosMutation.mutateAsync,
    createIncident: createIncidentMutation.mutateAsync,
    updateIncident: updateIncidentMutation.mutateAsync,
    sendMessage: sendMessageMutation.mutateAsync,
  };
}
