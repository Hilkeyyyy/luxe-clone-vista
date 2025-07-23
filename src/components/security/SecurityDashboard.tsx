
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, AlertTriangle, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import { useSecurityMonitoring } from '@/hooks/useSecurityMonitoring';
import { SecurityThreat } from '@/utils/securityMonitoring';

const SecurityDashboard: React.FC = () => {
  const { threats, healthStatus, clearThreats, refreshHealthStatus } = useSecurityMonitoring();

  const getThreatBadgeVariant = (severity: SecurityThreat['severity']) => {
    switch (severity) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'outline';
    }
  };

  const getHealthStatusIcon = () => {
    switch (healthStatus.status) {
      case 'healthy': return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'warning': return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'critical': return <XCircle className="h-5 w-5 text-red-500" />;
      default: return <Shield className="h-5 w-5 text-gray-500" />;
    }
  };

  const getHealthStatusColor = () => {
    switch (healthStatus.status) {
      case 'healthy': return 'text-green-600';
      case 'warning': return 'text-yellow-600';
      case 'critical': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Dashboard de Segurança</h2>
        <Button onClick={refreshHealthStatus} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Atualizar
        </Button>
      </div>

      {/* Status de Saúde */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {getHealthStatusIcon()}
            Status de Segurança
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Status:</span>
              <Badge 
                variant={healthStatus.status === 'healthy' ? 'outline' : 'destructive'}
                className={getHealthStatusColor()}
              >
                {healthStatus.status.toUpperCase()}
              </Badge>
            </div>

            {healthStatus.issues.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-2">Problemas Detectados:</h4>
                <ul className="text-sm space-y-1">
                  {healthStatus.issues.map((issue, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <XCircle className="h-3 w-3 text-red-500" />
                      {issue}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {healthStatus.recommendations.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-2">Recomendações:</h4>
                <ul className="text-sm space-y-1">
                  {healthStatus.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <CheckCircle className="h-3 w-3 text-blue-500" />
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Ameaças Recentes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Ameaças Recentes</span>
            {threats.length > 0 && (
              <Button onClick={clearThreats} variant="outline" size="sm">
                Limpar Histórico
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {threats.length === 0 ? (
            <div className="text-center py-8">
              <Shield className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <p className="text-gray-600">Nenhuma ameaça detectada</p>
            </div>
          ) : (
            <div className="space-y-4">
              {threats.map((threat, index) => (
                <Alert key={index} className="border-l-4 border-l-red-500">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant={getThreatBadgeVariant(threat.severity)}>
                            {threat.severity.toUpperCase()}
                          </Badge>
                          <span className="text-sm text-gray-500">
                            {threat.type.replace('_', ' ').toUpperCase()}
                          </span>
                        </div>
                        <p className="text-sm">{threat.description}</p>
                      </div>
                      <span className="text-xs text-gray-500 whitespace-nowrap ml-4">
                        {threat.timestamp.toLocaleString()}
                      </span>
                    </div>
                  </AlertDescription>
                </Alert>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Estatísticas de Segurança */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Ameaças Críticas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {threats.filter(t => t.severity === 'critical').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Ameaças de Alta Prioridade</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {threats.filter(t => t.severity === 'high').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Total de Ameaças</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {threats.length}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SecurityDashboard;
