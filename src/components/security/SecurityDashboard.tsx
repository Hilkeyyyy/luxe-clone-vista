
import React from 'react';
import { Shield, AlertTriangle, CheckCircle, Clock, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useSecurityMonitoring } from '@/hooks/useSecurityMonitoring';

export const SecurityDashboard = () => {
  const { threats, healthStatus, clearThreats, refreshHealthStatus } = useSecurityMonitoring();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'critical':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      default:
        return <Shield className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'bg-green-50 border-green-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      case 'critical':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 text-red-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Dashboard de Segurança</h2>
        <Button onClick={refreshHealthStatus} variant="outline" size="sm">
          Atualizar Status
        </Button>
      </div>

      {/* Status Geral */}
      <Card className={`${getStatusColor(healthStatus.status)} border-2`}>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            {getStatusIcon(healthStatus.status)}
            Status de Segurança: {healthStatus.status === 'healthy' ? 'Saudável' : 
                                  healthStatus.status === 'warning' ? 'Atenção' : 'Crítico'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {healthStatus.issues.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium">Problemas Identificados:</h4>
              <ul className="list-disc pl-5 space-y-1">
                {healthStatus.issues.map((issue, index) => (
                  <li key={index} className="text-sm">{issue}</li>
                ))}
              </ul>
            </div>
          )}
          
          {healthStatus.recommendations.length > 0 && (
            <div className="space-y-2 mt-4">
              <h4 className="font-medium">Recomendações:</h4>
              <ul className="list-disc pl-5 space-y-1">
                {healthStatus.recommendations.map((rec, index) => (
                  <li key={index} className="text-sm">{rec}</li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Estatísticas Rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Ameaças Ativas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{threats.filter(t => !t.resolved).length}</div>
            <p className="text-xs text-muted-foreground">Total de ameaças não resolvidas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total de Ameaças</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{threats.length}</div>
            <p className="text-xs text-muted-foreground">Detectadas recentemente</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Última Ameaça</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {threats.length > 0 ? (
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {new Date(threats[0].timestamp).toLocaleTimeString()}
                </div>
              ) : (
                'Nenhuma'
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {threats.length > 0 ? 'Detectada' : 'Nenhuma ameaça detectada'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Ameaças */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Ameaças Recentes
            </CardTitle>
            {threats.length > 0 && (
              <Button onClick={clearThreats} variant="outline" size="sm">
                Limpar Todas
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {threats.length === 0 ? (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                Nenhuma ameaça detectada. Sistema funcionando normalmente.
              </AlertDescription>
            </Alert>
          ) : (
            <div className="space-y-3">
              {threats.slice(0, 10).map((threat) => (
                <div key={threat.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className={getSeverityColor(threat.severity)}>
                        {threat.severity}
                      </Badge>
                      <span className="text-sm font-medium">{threat.type}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{threat.description}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(threat.timestamp).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {threat.resolved ? (
                      <Badge variant="outline" className="bg-green-50 text-green-700">
                        Resolvida
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-red-50 text-red-700">
                        Ativa
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
